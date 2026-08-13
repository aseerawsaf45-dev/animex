import { prisma } from "../prisma";
import type { AniListAnime } from "../anilist.types";

export async function ingestAnime(data: AniListAnime) {
  const animeStatusMap: Record<string, any> = {
    FINISHED: "FINISHED",
    RELEASING: "RELEASING",
    NOT_YET_RELEASED: "NOT_YET_RELEASED",
    CANCELLED: "CANCELLED",
    HIATUS: "HIATUS",
  };

  const seasonMap: Record<string, any> = {
    SPRING: "SPRING",
    SUMMER: "SUMMER",
    FALL: "FALL",
    WINTER: "WINTER",
  };

  const status = animeStatusMap[data.status || ""] || "UNKNOWN";
  const season = seasonMap[data.season || ""] || null;
  const startDate = data.startDate?.year ? new Date(data.startDate.year, (data.startDate.month || 1) - 1, data.startDate.day || 1) : null;
  const endDate = data.endDate?.year ? new Date(data.endDate.year, (data.endDate.month || 1) - 1, data.endDate.day || 1) : null;

  // 1. Fetch Jikan Data if idMal exists
  let malScore: number | null = null;
  let malRank: number | null = null;
  let jikanThemes: string[] = [];

  if (data.idMal) {
    try {
      const { getJikanAnime } = require("../jikan");
      // Fast 1 second timeout wrapper for Jikan
      const jikanPromise = getJikanAnime(data.idMal);
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 1000));
      const jikanData: any = await Promise.race([jikanPromise, timeoutPromise]);

      if (jikanData?.data) {
        malScore = jikanData.data.score || null;
        malRank = jikanData.data.rank || null;
        jikanThemes = (jikanData.data.themes || []).map((t: any) => t.name);
      }
    } catch {
      // Continue without blocking ingestion
    }
  }

  // Upsert the main Anime record
  const anime = await prisma.anime.upsert({
    where: { id: data.id },
    update: {
      titleRomaji: data.title.romaji,
      titleEnglish: data.title.english,
      titleJapanese: data.title.native,
      synopsis: data.description,
      coverImage: data.coverImage?.extraLarge || data.coverImage?.large,
      bannerImage: data.bannerImage,
      episodes: data.episodes,
      duration: data.duration,
      status,
      season,
      seasonYear: data.seasonYear,
      averageScore: data.averageScore,
      meanScore: data.meanScore,
      popularity: data.popularity,
      malId: data.idMal || null,
      malScore,
      malRank,
      isAdult: data.isAdult || false,
      countryOfOrigin: data.countryOfOrigin,
      startDate,
      endDate,
      trailerSite: data.trailer?.site,
      trailerUrl: data.trailer?.id ? (data.trailer.site === "youtube" ? `https://www.youtube.com/watch?v=${data.trailer.id}` : data.trailer.id) : null,
      syncedAt: new Date(),
    },
    create: {
      id: data.id,
      slug: `${data.id}-${data.title.romaji.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")}`,
      titleRomaji: data.title.romaji,
      titleEnglish: data.title.english,
      titleJapanese: data.title.native,
      synopsis: data.description,
      coverImage: data.coverImage?.extraLarge || data.coverImage?.large,
      bannerImage: data.bannerImage,
      episodes: data.episodes,
      duration: data.duration,
      status,
      season,
      seasonYear: data.seasonYear,
      averageScore: data.averageScore,
      meanScore: data.meanScore,
      popularity: data.popularity,
      malId: data.idMal || null,
      malScore,
      malRank,
      isAdult: data.isAdult || false,
      countryOfOrigin: data.countryOfOrigin,
      startDate,
      endDate,
      trailerSite: data.trailer?.site,
      trailerUrl: data.trailer?.id ? (data.trailer.site === "youtube" ? `https://www.youtube.com/watch?v=${data.trailer.id}` : data.trailer.id) : null,
    },
  });

  // Handle Genres
  if (data.genres && data.genres.length > 0) {
    for (const genreName of data.genres) {
      const genre = await prisma.genre.upsert({
        where: { name: genreName },
        update: {},
        create: { name: genreName },
      });

      await prisma.animeGenre.upsert({
        where: {
          animeId_genreId: {
            animeId: anime.id,
            genreId: genre.id,
          },
        },
        update: {},
        create: {
          animeId: anime.id,
          genreId: genre.id,
        },
      });
    }
  }

  // Handle Jikan Themes
  if (jikanThemes.length > 0) {
    for (const themeName of jikanThemes) {
      const theme = await prisma.theme.upsert({
        where: { name: themeName },
        update: {},
        create: { name: themeName },
      });

      await prisma.animeTheme.upsert({
        where: {
          animeId_themeId: {
            animeId: anime.id,
            themeId: theme.id,
          },
        },
        update: {},
        create: {
          animeId: anime.id,
          themeId: theme.id,
        },
      });
    }
  }

  // Generate and store embedding
  const { encodeAnimeFeatures } = require("../recommendations/features");
  
  // We need the anime with genres and themes for the feature encoder
  const animeWithRelations = await prisma.anime.findUnique({
    where: { id: anime.id },
    include: { genres: { include: { genre: true } }, themes: { include: { theme: true } } }
  });

  if (animeWithRelations) {
    const vector = encodeAnimeFeatures(animeWithRelations);
    // Since it's an Unsupported("vector(384)"), we use raw SQL to insert the embedding
    await prisma.$executeRawUnsafe(
      `INSERT INTO "AnimeEmbedding" ("animeId", "featureVector", "synopsis", "updatedAt") 
       VALUES ($1, $2::vector, $3, NOW()) 
       ON CONFLICT ("animeId") DO UPDATE 
       SET "featureVector" = $2::vector, "synopsis" = $3, "updatedAt" = NOW()`,
      anime.id,
      JSON.stringify(vector),
      anime.synopsis || ""
    );
  }

  return anime;
}
