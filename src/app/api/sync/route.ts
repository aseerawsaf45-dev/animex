import { NextRequest, NextResponse } from "next/server";
import { getTrendingAnime } from "@/lib/anilist";
import { ingestAnime } from "@/lib/sync/ingestion";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    // const adminSecret = req.headers.get("x-admin-secret");
    // if (adminSecret !== process.env.ADMIN_SECRET && session?.user?.role !== "ADMIN") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { page = 1, perPage = 50 } = await req.json().catch(() => ({}));

    const animeList = await getTrendingAnime(page, perPage);
    let synced = 0;

    for (const anime of animeList) {
      await ingestAnime(anime);
      synced++;
    }

    return NextResponse.json({ success: true, synced, message: `Synced ${synced} anime.` });
  } catch (error: any) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: error.message || "Failed to sync" }, { status: 500 });
  }
}
