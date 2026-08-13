import { Anime, UserEvent, EventType, Genre, Theme } from "@prisma/client";

// Feature Engineering Configuration
const EVENT_WEIGHTS: Record<EventType, number> = {
  PAGE_VIEW: 0.1,
  VIEW_ANIME: 0.2,
  CARD_CLICK: 0.1,
  SEARCH: 0.1,
  WATCHLIST_ADD: 0.6,
  WATCHLIST_REMOVE: -0.2,
  START_ANIME: 0.3,
  COMPLETE_ANIME: 1.0,
  DROP_ANIME: -0.8,
  RATE_ANIME: 0.8, // Baseline, actual weight depends on the rating score
  LIKE_ANIME: 0.9,
  DISLIKE_ANIME: -1.0,
  FILTER_GENRE: 0.2,
  SELECT_MOOD: 0.3,
  OPEN_SIMILAR: 0.2,
  RECOMMENDATION_CLICK: 0.2,
  RECOMMENDATION_DISMISS: -0.2,
  ONBOARDING_COMPLETE: 0,
};

/**
 * Calculates a time decay multiplier.
 * Older events have less impact than recent ones.
 * Half-life of 30 days.
 */
function calculateTimeDecay(eventDate: Date): number {
  const ageInDays = (Date.now() - eventDate.getTime()) / (1000 * 60 * 60 * 24);
  const halfLife = 30; // days
  return Math.pow(0.5, ageInDays / halfLife);
}

/**
 * Extracts a dynamic user preference vector from their interaction history.
 */
export function buildUserPreferenceProfile(events: UserEvent[]) {
  const genrePreferences: Record<string, number> = {};
  const themePreferences: Record<string, number> = {};
  const interactedAnimeIds = new Set<number>();
  const dislikedAnimeIds = new Set<number>();

  for (const event of events) {
    if (!event.animeId) continue;
    interactedAnimeIds.add(event.animeId);

    const baseWeight = EVENT_WEIGHTS[event.eventType] || 0;
    let actualWeight = baseWeight;

    // Adjust rate event weight based on the actual score
    if (event.eventType === "RATE_ANIME" && event.metadata) {
      const meta = event.metadata as { score?: number };
      if (meta.score !== undefined) {
        // Map 1-10 to -1.0 to 1.0
        actualWeight = ((meta.score - 5) / 5) * baseWeight;
      }
    }

    if (actualWeight < 0) {
      dislikedAnimeIds.add(event.animeId);
    }

    const decay = calculateTimeDecay(event.createdAt);
    const finalImpact = actualWeight * decay;

    // In a real ML pipeline, we would fetch the genres/themes of the anime here
    // and distribute the finalImpact across those features.
    // For MVP, we will assume this is handled dynamically during candidate ranking.
  }

  return {
    genrePreferences,
    themePreferences,
    interactedAnimeIds: Array.from(interactedAnimeIds),
    dislikedAnimeIds: Array.from(dislikedAnimeIds)
  };
}

/**
 * Encodes an anime into a structured feature vector.
 * For MVP, we use a simple dummy array representing multi-hot encodings.
 * In production, this integrates with SentenceTransformers/FastAPI.
 */
export function encodeAnimeFeatures(
  anime: Anime & { genres: { genre: Genre }[]; themes: { theme: Theme }[] }
): number[] {
  // Dummy 384-dimensional vector to match pgvector(384)
  const vector = new Array(384).fill(0);
  
  // Hash genres to slots
  anime.genres.forEach((ag, idx) => {
    const slot = ag.genre.id % 100;
    vector[slot] = 1;
  });

  // Hash themes to slots
  anime.themes.forEach((at, idx) => {
    const slot = 100 + (at.theme.id % 100);
    vector[slot] = 1;
  });

  // Normalize metadata (50/50 Blend of Jikan and AniList scores)
  const aniScore = anime.averageScore ? anime.averageScore / 100 : null;
  const malScoreNormalized = anime.malScore ? anime.malScore / 10 : null;
  
  if (aniScore !== null && malScoreNormalized !== null) {
    vector[200] = (aniScore + malScoreNormalized) / 2;
  } else if (aniScore !== null) {
    vector[200] = aniScore;
  } else if (malScoreNormalized !== null) {
    vector[200] = malScoreNormalized;
  } else {
    vector[200] = 0.5;
  }
  
  vector[201] = anime.popularity ? Math.min(anime.popularity / 500000, 1.0) : 0;
  vector[202] = anime.malRank ? Math.max(1.0 - (anime.malRank / 10000), 0) : 0;
  
  return vector;
}

/**
 * Synthesizes a cold-start feature vector directly from onboarding answers.
 */
export async function buildSynthesizedVector(
  selectedGenres: string[],
  selectedThemes: string[]
): Promise<number[]> {
  const { prisma } = require("../prisma");
  const vector = new Array(384).fill(0);

  if (selectedGenres && selectedGenres.length > 0) {
    const dbGenres = await prisma.genre.findMany({
      where: { name: { in: selectedGenres, mode: "insensitive" } }
    });
    dbGenres.forEach((g: any) => {
      const slot = g.id % 100;
      vector[slot] = 1.0;
    });
  }

  if (selectedThemes && selectedThemes.length > 0) {
    const dbThemes = await prisma.theme.findMany({
      where: { name: { in: selectedThemes, mode: "insensitive" } }
    });
    dbThemes.forEach((t: any) => {
      const slot = 100 + (t.id % 100);
      vector[slot] = 1.0;
    });
  }

  vector[200] = 0.8;
  vector[201] = 0.5;

  return vector;
}
