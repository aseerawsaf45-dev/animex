import { Anime, Genre, Theme, Prisma } from "@prisma/client";
import { prisma } from "../prisma";

export type CandidateAnime = Anime & {
  genres: { genre: Genre }[];
  themes: { theme: Theme }[];
  _source?: string;
  _similarity?: number;
};

/**
 * Generates an initial pool of candidate anime for ranking.
 * Combines content similarity, popularity, and generic exploration.
 */
export async function generateCandidates(
  userId: string,
  interactedAnimeIds: number[],
  dislikedAnimeIds: number[],
  limit: number = 200
): Promise<CandidateAnime[]> {
  const excludeIds = [...interactedAnimeIds, ...dislikedAnimeIds];
  const candidatesMap = new Map<number, CandidateAnime>();

  // 1. Fetch Content-based similarity via pgvector (High Priority)
  try {
    if (interactedAnimeIds.length > 0) {
      // Fetch embeddings for anime the user liked
      const likedEmbeddings = await prisma.$queryRaw<any[]>`
        SELECT "featureVector"::text
        FROM "AnimeEmbedding"
        WHERE "animeId" IN (${Prisma.join(interactedAnimeIds)})
      `;

      if (likedEmbeddings && likedEmbeddings.length > 0) {
        const vectorLen = 384;
        let avgVector = new Array(vectorLen).fill(0);

        for (const row of likedEmbeddings) {
          const vecArr = JSON.parse(row.featureVector);
          for (let i = 0; i < vectorLen; i++) {
            avgVector[i] += vecArr[i] || 0;
          }
        }
        for (let i = 0; i < vectorLen; i++) {
          avgVector[i] = avgVector[i] / likedEmbeddings.length;
        }

        const vectorStr = JSON.stringify(avgVector);

        // Find most similar anime via pgvector cosine distance (<=>)
        const similarAnimeRaw = await prisma.$queryRaw<any[]>`
          SELECT a.id, ae."featureVector" <=> ${vectorStr}::vector AS distance
          FROM "Anime" a
          JOIN "AnimeEmbedding" ae ON a.id = ae."animeId"
          WHERE a.id NOT IN (${excludeIds.length > 0 ? Prisma.join(excludeIds) : -1})
          ORDER BY distance ASC
          LIMIT ${Math.floor(limit * 0.6)};
        `;

        if (similarAnimeRaw.length > 0) {
          const simIds = similarAnimeRaw.map((r) => r.id);
          const distMap = new Map<number, number>(similarAnimeRaw.map((r) => [r.id, r.distance]));

          // High-speed batch query (1 query instead of N queries)
          const fullAnimeList = await prisma.anime.findMany({
            where: { id: { in: simIds } },
            include: {
              genres: { include: { genre: true } },
              themes: { include: { theme: true } },
            },
          });

          fullAnimeList.forEach((fullAnime) => {
            const distance = distMap.get(fullAnime.id) || 0;
            const sim = Math.max(0, 1 - distance);
            candidatesMap.set(fullAnime.id, { ...fullAnime, _source: "vector_similarity", _similarity: sim });
          });
        }
      }
    } else {
      // COLD START: Check onboarding preferences
      const userPref = await prisma.userPreference.findUnique({
        where: { userId },
      });

      if (userPref) {
        const { buildSynthesizedVector } = require("./features");
        const genres = (userPref.genreWeights as string[]) || [];
        const themes = (userPref.themeWeights as string[]) || [];

        if (genres.length > 0 || themes.length > 0) {
          const synthVector = await buildSynthesizedVector(genres, themes);
          const vectorStr = JSON.stringify(synthVector);

          const similarAnimeRaw = await prisma.$queryRaw<any[]>`
            SELECT a.id, ae."featureVector" <=> ${vectorStr}::vector AS distance
            FROM "Anime" a
            JOIN "AnimeEmbedding" ae ON a.id = ae."animeId"
            ORDER BY distance ASC
            LIMIT ${Math.floor(limit * 0.75)};
          `;

          if (similarAnimeRaw.length > 0) {
            const simIds = similarAnimeRaw.map((r) => r.id);
            const distMap = new Map<number, number>(similarAnimeRaw.map((r) => [r.id, r.distance]));

            const fullAnimeList = await prisma.anime.findMany({
              where: { id: { in: simIds } },
              include: {
                genres: { include: { genre: true } },
                themes: { include: { theme: true } },
              },
            });

            fullAnimeList.forEach((fullAnime) => {
              const distance = distMap.get(fullAnime.id) || 0;
              const sim = Math.max(0, 1 - distance);
              candidatesMap.set(fullAnime.id, { ...fullAnime, _source: "synthesized_vector", _similarity: sim });
            });
          }
        }
      }
    }
  } catch (err) {
    console.error("Vector retrieval failed, falling back", err);
  }

  // 2. Fetch Genre & Questionnaire Matched Candidates directly from DB
  try {
    const userPref = await prisma.userPreference.findUnique({
      where: { userId },
    });

    const genres: string[] = (userPref?.genreWeights as string[]) || [];
    const eras: string[] = (userPref?.preferredEras as string[]) || [];

    if (genres.length > 0) {
      // Find anime with matching genres directly
      const genreMatchedAnime = await prisma.anime.findMany({
        where: {
          status: { in: ["RELEASING", "FINISHED"] },
          NOT: { id: { in: excludeIds } },
          genres: {
            some: {
              genre: {
                name: { in: genres, mode: "insensitive" }
              }
            }
          }
        },
        include: {
          genres: { include: { genre: true } },
          themes: { include: { theme: true } },
        },
        orderBy: { averageScore: "desc" },
        take: Math.floor(limit * 0.5),
      });

      genreMatchedAnime.forEach((anime) => {
        if (!candidatesMap.has(anime.id)) {
          // Calculate direct overlap similarity
          const animeGenres = anime.genres.map(g => g.genre.name.toLowerCase());
          const matchedCount = genres.filter(g => animeGenres.includes(g.toLowerCase())).length;
          const sim = 0.6 + (matchedCount / Math.max(genres.length, 1)) * 0.35;
          candidatesMap.set(anime.id, { ...anime, _source: "genre_match", _similarity: sim });
        }
      });
    }

    // If eras are preferred, fetch high-scoring anime from those eras
    if (eras.length > 0) {
      const eraYears: { gte?: Date, lte?: Date }[] = [];
      eras.forEach(e => {
        if (e.includes("90s")) eraYears.push({ lte: new Date("1999-12-31") });
        if (e.includes("2000s")) eraYears.push({ gte: new Date("2000-01-01"), lte: new Date("2009-12-31") });
        if (e.includes("2010s")) eraYears.push({ gte: new Date("2010-01-01"), lte: new Date("2019-12-31") });
        if (e.includes("2020s")) eraYears.push({ gte: new Date("2020-01-01") });
      });

      if (eraYears.length > 0) {
        const eraMatchedAnime = await prisma.anime.findMany({
          where: {
            status: { in: ["RELEASING", "FINISHED"] },
            NOT: { id: { in: excludeIds } },
            OR: eraYears.map(y => ({ startDate: y })),
          },
          include: {
            genres: { include: { genre: true } },
            themes: { include: { theme: true } },
          },
          orderBy: { averageScore: "desc" },
          take: Math.floor(limit * 0.25),
        });

        eraMatchedAnime.forEach((anime) => {
          if (!candidatesMap.has(anime.id)) {
            candidatesMap.set(anime.id, { ...anime, _source: "era_match", _similarity: 0.7 });
          }
        });
      }
    }
  } catch (err) {
    console.error("Genre & Era candidate retrieval error:", err);
  }

  // 3. Fetch Popular / Highly Rated (Exploration & Baselines)
  const popularCandidates = await prisma.anime.findMany({
    where: {
      status: { in: ["RELEASING", "FINISHED"] },
      NOT: { id: { in: excludeIds } },
    },
    include: {
      genres: { include: { genre: true } },
      themes: { include: { theme: true } },
    },
    orderBy: { averageScore: "desc" },
    take: Math.floor(limit * 0.3),
  });

  popularCandidates.forEach((anime) => {
    if (!candidatesMap.has(anime.id)) {
      candidatesMap.set(anime.id, { ...anime, _source: "high_rated", _similarity: 0.4 });
    }
  });

  // 4. Seasonal Releases
  const recentCandidates = await prisma.anime.findMany({
    where: {
      status: "RELEASING",
      NOT: { id: { in: excludeIds } },
    },
    include: {
      genres: { include: { genre: true } },
      themes: { include: { theme: true } },
    },
    orderBy: { startDate: "desc" },
    take: Math.floor(limit * 0.2),
  });

  recentCandidates.forEach((anime) => {
    if (!candidatesMap.has(anime.id)) {
      candidatesMap.set(anime.id, { ...anime, _source: "seasonal", _similarity: 0.35 });
    }
  });

  return Array.from(candidatesMap.values());
}
