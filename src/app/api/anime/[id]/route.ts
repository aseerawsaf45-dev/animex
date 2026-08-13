import { NextRequest, NextResponse } from "next/server";
import { getAnimeById } from "@/lib/anilist";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const animeId = parseInt(id);

  if (isNaN(animeId)) {
    return NextResponse.json({ success: false, error: "Invalid anime ID" }, { status: 400 });
  }

  try {
    const data = await getAnimeById(animeId);
    if (!data) {
      return NextResponse.json({ success: false, error: "Anime not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch anime" }, { status: 500 });
  }
}
