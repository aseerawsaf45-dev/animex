import { AniListDetailResponseSchema, AniListSearchResponseSchema, type AniListAnime } from "./anilist.types";

const ANILIST_URL = process.env.ANILIST_API_URL || "https://graphql.anilist.co";

const MEDIA_FIELDS = `
  id
  idMal
  title {
    romaji
    english
    native
  }
  description
  coverImage {
    extraLarge
    large
    medium
    color
  }
  bannerImage
  episodes
  duration
  status
  season
  seasonYear
  averageScore
  meanScore
  popularity
  genres
  startDate {
    year
    month
    day
  }
  endDate {
    year
    month
    day
  }
  trailer {
    id
    site
    thumbnail
  }
  isAdult
  countryOfOrigin
`;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchAniList(query: string, variables: Record<string, any> = {}) {
  const response = await fetch(ANILIST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
  });

  if (response.status === 429) {
    console.warn("AniList Rate Limit Hit (429). Retrying after 2.5s...");
    await delay(2500);
    return fetchAniList(query, variables);
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`AniList API Error (${response.status}):`, errorText);
    throw new Error(`AniList API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getAnimeById(id: number): Promise<AniListAnime | null> {
  const query = `
    query ($id: Int) {
      Media (id: $id, type: ANIME) {
        ${MEDIA_FIELDS}
      }
    }
  `;

  try {
    const data = await fetchAniList(query, { id });
    const parsed = AniListDetailResponseSchema.safeParse(data);
    if (parsed.success) {
      return parsed.data.data.Media;
    }
    console.error("Zod Validation Error (getAnimeById):", parsed.error);
    return null;
  } catch (error) {
    console.error("Failed to get anime by ID:", error);
    return null;
  }
}

export async function getTrendingAnime(page = 1, perPage = 20): Promise<AniListAnime[]> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `;

  try {
    const data = await fetchAniList(query, { page, perPage });
    const parsed = AniListSearchResponseSchema.safeParse(data);
    if (parsed.success) {
      return parsed.data.data.Page.media;
    }
    console.error("Zod Validation Error (getTrendingAnime):", parsed.error);
    return [];
  } catch (error) {
    console.error("Failed to get trending anime:", error);
    return [];
  }
}

export async function getAnimeList(sort: string[] = ["POPULARITY_DESC"], page = 1, perPage = 50): Promise<AniListAnime[]> {
  const query = `
    query ($page: Int, $perPage: Int, $sort: [MediaSort]) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(type: ANIME, sort: $sort, isAdult: false) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `;

  try {
    const data = await fetchAniList(query, { page, perPage, sort });
    const parsed = AniListSearchResponseSchema.safeParse(data);
    if (parsed.success) {
      return parsed.data.data.Page.media;
    }
    console.error("Zod Validation Error (getAnimeList):", parsed.error);
    return [];
  } catch (error) {
    console.error("Failed to get anime list:", error);
    return [];
  }
}

export async function getSeasonalAnime(season: string, seasonYear: number, page = 1, perPage = 20): Promise<AniListAnime[]> {
  const query = `
    query ($season: MediaSeason, $seasonYear: Int, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(type: ANIME, season: $season, seasonYear: $seasonYear, sort: [POPULARITY_DESC], isAdult: false) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `;

  try {
    const data = await fetchAniList(query, { season, seasonYear, page, perPage });
    const parsed = AniListSearchResponseSchema.safeParse(data);
    if (parsed.success) {
      return parsed.data.data.Page.media;
    }
    console.error("Zod Error (getSeasonalAnime):", parsed.error);
    return [];
  } catch (error) {
    console.error("Failed to get seasonal anime:", error);
    return [];
  }
}

export async function searchAnime(searchTerm: string, page = 1, perPage = 20): Promise<AniListAnime[]> {
  const query = `
    query ($search: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(type: ANIME, search: $search, sort: [POPULARITY_DESC], isAdult: false) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `;

  try {
    const data = await fetchAniList(query, { search: searchTerm, page, perPage });
    const parsed = AniListSearchResponseSchema.safeParse(data);
    if (parsed.success) {
      return parsed.data.data.Page.media;
    }
    console.error("Zod Error (searchAnime):", parsed.error);
    return [];
  } catch (error) {
    console.error("Failed to search anime:", error);
    return [];
  }
}
