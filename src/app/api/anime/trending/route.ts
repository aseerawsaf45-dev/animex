import { NextRequest, NextResponse } from "next/server";
import { getTrendingAnime } from "@/lib/anilist";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("perPage") || "20");

  try {
    const data = await getTrendingAnime(page, perPage);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch trending anime" }, { status: 500 });
  }
}
