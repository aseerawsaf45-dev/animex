import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { searchAnime } from "@/lib/anilist";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q");
  const genre = searchParams.get("genre");
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("perPage") || "20");

  try {
    // If genre parameter is provided, query database for anime matching genre
    if (genre) {
      const dbAnime = await prisma.anime.findMany({
        where: {
          genres: {
            some: {
              genre: {
                name: {
                  equals: genre,
                  mode: "insensitive",
                },
              },
            },
          },
        },
        include: {
          genres: {
            include: { genre: true },
          },
        },
        orderBy: [{ averageScore: "desc" }, { popularity: "desc" }],
        take: perPage,
        skip: (page - 1) * perPage,
      });

      if (dbAnime && dbAnime.length > 0) {
        const normalized = dbAnime.map((a) => ({
          id: a.id,
          title: { english: a.titleEnglish, romaji: a.titleRomaji },
          coverImage: { large: a.coverImage },
          bannerImage: a.bannerImage,
          genres: a.genres.map((g) => g.genre.name),
          averageScore: a.averageScore,
          episodes: a.episodes,
          status: a.status,
          seasonYear: a.seasonYear,
        }));
        return NextResponse.json({ success: true, data: normalized });
      }
    }

    // If query parameter is provided
    if (query) {
      const dbAnime = await prisma.anime.findMany({
        where: {
          OR: [
            { titleEnglish: { contains: query, mode: "insensitive" } },
            { titleRomaji: { contains: query, mode: "insensitive" } },
            { synopsis: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          genres: {
            include: { genre: true },
          },
        },
        orderBy: [{ popularity: "desc" }],
        take: perPage,
      });

      if (dbAnime && dbAnime.length > 0) {
        const normalized = dbAnime.map((a) => ({
          id: a.id,
          title: { english: a.titleEnglish, romaji: a.titleRomaji },
          coverImage: { large: a.coverImage },
          bannerImage: a.bannerImage,
          genres: a.genres.map((g) => g.genre.name),
          averageScore: a.averageScore,
          episodes: a.episodes,
          status: a.status,
          seasonYear: a.seasonYear,
        }));
        return NextResponse.json({ success: true, data: normalized });
      }

      // Fallback to AniList API if query yielded no DB results
      const data = await searchAnime(query, page, perPage);
      return NextResponse.json({ success: true, data });
    }

    // If neither query nor genre gave DB results, return top popular anime
    const topAnime = await prisma.anime.findMany({
      orderBy: { popularity: "desc" },
      take: perPage,
      include: { genres: { include: { genre: true } } },
    });

    const normalized = topAnime.map((a) => ({
      id: a.id,
      title: { english: a.titleEnglish, romaji: a.titleRomaji },
      coverImage: { large: a.coverImage },
      bannerImage: a.bannerImage,
      genres: a.genres.map((g) => g.genre.name),
      averageScore: a.averageScore,
      episodes: a.episodes,
      status: a.status,
      seasonYear: a.seasonYear,
    }));

    return NextResponse.json({ success: true, data: normalized });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ success: false, error: "Failed to search anime" }, { status: 500 });
  }
}
