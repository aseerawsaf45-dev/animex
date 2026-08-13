export interface JikanAnimeResponse {
  data: {
    mal_id: number;
    url: string;
    title: string;
    title_english: string;
    title_japanese: string;
    score: number;
    scored_by: number;
    rank: number;
    popularity: number;
    members: number;
    favorites: number;
    synopsis: string;
    background: string;
    genres: Array<{ mal_id: number; name: string }>;
    themes: Array<{ mal_id: number; name: string }>;
    studios: Array<{ mal_id: number; name: string }>;
  };
}

const JIKAN_API_URL = "https://api.jikan.moe/v4";

// Jikan rate limits: 3 requests per second, 60 requests per minute
// We implement a simple delay utility to avoid 429 Too Many Requests
export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getJikanAnime(malId: number): Promise<JikanAnimeResponse | null> {
  try {
    const response = await fetch(`${JIKAN_API_URL}/anime/${malId}`);
    
    if (response.status === 429) {
      console.warn(`Jikan Rate Limit Hit for MAL ID ${malId}. Retrying after 1s...`);
      await delay(1000);
      return getJikanAnime(malId); // Retry once
    }
    
    if (!response.ok) {
      console.error(`Jikan API Error: ${response.status} ${response.statusText}`);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch from Jikan:", error);
    return null;
  }
}
