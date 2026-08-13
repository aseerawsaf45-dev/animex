import { NextRequest, NextResponse } from "next/server";
import { getSeasonalAnime } from "@/lib/anilist";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  
  // Default to current season/year
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  
  let currentSeason = "WINTER";
  if (month >= 3 && month <= 5) currentSeason = "SPRING";
  else if (month >= 6 && month <= 8) currentSeason = "SUMMER";
  else if (month >= 9 && month <= 11) currentSeason = "FALL";

  const season = searchParams.get("season") || currentSeason;
  const seasonYear = parseInt(searchParams.get("year") || year.toString());
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("perPage") || "20");

  try {
    const data = await getSeasonalAnime(season, seasonYear, page, perPage);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch seasonal anime" }, { status: 500 });
  }
}
