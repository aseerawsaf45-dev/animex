import { getAnimeList } from "./src/lib/anilist";
import { prisma } from "./src/lib/prisma";

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

async function seedBatch() {
  console.log("=== Fast High-Volume Seeder Starting (Target: 700+ Anime) ===");
  try {
    const listMap = new Map<number, any>();
    const categories = [
      { name: "Trending", sort: ["TRENDING_DESC"] },
      { name: "Popular", sort: ["POPULARITY_DESC"] },
      { name: "Top Rated", sort: ["SCORE_DESC"] },
      { name: "Most Favourited", sort: ["FAVOURITES_DESC"] },
    ];

    for (const cat of categories) {
      console.log(`Collecting ${cat.name}...`);
      for (let page = 1; page <= 6; page++) {
        try {
          const list = await getAnimeList(cat.sort, page, 50);
          list.forEach((a) => listMap.set(a.id, a));
          await new Promise((r) => setTimeout(r, 200));
        } catch {
          break;
        }
      }
    }

    const allAnime = Array.from(listMap.values());
    console.log(`Total Unique Titles Collected: ${allAnime.length}`);

    let count = 0;
    // Process in batches of 15
    for (let i = 0; i < allAnime.length; i += 15) {
      const chunk = allAnime.slice(i, i + 15);
      await Promise.all(
        chunk.map(async (data) => {
          try {
            const status = animeStatusMap[data.status || ""] || "UNKNOWN";
            const season = seasonMap[data.season || ""] || null;
            const genresList = (data.genres || []).map((g: string) => ({ name: g }));

            const slug = (data.title?.romaji || data.title?.english || `anime-${data.id}`)
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "") || `anime-${data.id}`;

            const animeRecord = await prisma.anime.upsert({
              where: { id: data.id },
              update: {
                slug,
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
              },
              create: {
                id: data.id,
                slug,
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
              },
            });

            // Upsert Genres
            for (const g of genresList) {
              const genreObj = await prisma.genre.upsert({
                where: { name: g.name },
                update: {},
                create: { name: g.name },
              });
              await prisma.animeGenre.upsert({
                where: { animeId_genreId: { animeId: animeRecord.id, genreId: genreObj.id } },
                update: {},
                create: { animeId: animeRecord.id, genreId: genreObj.id },
              });
            }

            // Create 384-dimensional Embedding Vector
            const embeddingVector = new Array(384).fill(0);
            (data.genres || []).forEach((g: string, idx: number) => {
              const hash = g.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
              embeddingVector[hash % 100] = 1.0;
            });
            embeddingVector[200] = data.averageScore ? data.averageScore / 100 : 0.7;
            embeddingVector[201] = data.popularity ? Math.min(data.popularity / 500000, 1.0) : 0.5;

            const vectorString = `[${embeddingVector.join(",")}]`;
            await prisma.$executeRawUnsafe(
              `INSERT INTO "AnimeEmbedding" ("animeId", "featureVector", "updatedAt")
               VALUES ($1, $2::vector, NOW())
               ON CONFLICT ("animeId") DO UPDATE
               SET "featureVector" = $2::vector, "updatedAt" = NOW()`,
              animeRecord.id,
              vectorString
            );

            count++;
          } catch (err) {
            // Ignore single item errors
          }
        })
      );
      console.log(`[Progress] Ingested ${Math.min(i + 15, allAnime.length)} / ${allAnime.length} titles...`);
    }

    const finalCount = await prisma.anime.count();
    console.log(`=== Ingestion Complete! Total Database Titles: ${finalCount} ===`);
  } catch (error) {
    console.error("Batch seed failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedBatch();
