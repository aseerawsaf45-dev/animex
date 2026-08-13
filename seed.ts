import { getAnimeList } from "./src/lib/anilist";
import { ingestAnime } from "./src/lib/sync/ingestion";
import { prisma } from "./src/lib/prisma";

async function seed() {
  console.log("=== Launching Dual-API Bulk Library Ingestion ===");
  try {
    const listMap = new Map<number, any>();

    const categories = [
      { name: "Trending", sort: ["TRENDING_DESC"] },
      { name: "Popular", sort: ["POPULARITY_DESC"] },
      { name: "Top Rated", sort: ["SCORE_DESC"] },
      { name: "Most Favourited", sort: ["FAVOURITES_DESC"] },
    ];

    for (const cat of categories) {
      console.log(`Fetching ${cat.name} pages 1-8...`);
      for (let page = 1; page <= 8; page++) {
        const list = await getAnimeList(cat.sort, page, 50);
        list.forEach(a => listMap.set(a.id, a));
        await new Promise(r => setTimeout(r, 400));
      }
    }

    const allAnime = Array.from(listMap.values());
    console.log(`Total Unique Titles Collected: ${allAnime.length}`);

    let i = 1;
    for (const anime of allAnime) {
      console.log(`[${i}/${allAnime.length}] Ingesting: ${anime.title.romaji}...`);
      try {
        await ingestAnime(anime);
      } catch (err) {
        console.error(`Failed to ingest ${anime.title.romaji}:`, err);
      }
      i++;
    }
    console.log("=== Bulk Library Ingestion Complete! ===");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
