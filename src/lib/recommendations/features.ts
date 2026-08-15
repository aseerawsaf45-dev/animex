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

export interface UserPreferenceData {
  genres: string[];
  pacing?: string;
  protagonist?: string;
  atmosphere?: string;
  payoff?: string;
  eras: string[];
  experience?: string;
}

export interface UserProfile {
  genrePreferences: Record<string, number>;
  themePreferences: Record<string, number>;
  interactedAnimeIds: number[];
  dislikedAnimeIds: number[];
  onboardingPreferences?: UserPreferenceData;
}

/**
 * Extracts a dynamic user preference vector from their interaction history and onboarding answers.
 */
export function buildUserPreferenceProfile(
  events: UserEvent[],
  userPreferenceRecord?: any
): UserProfile {
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
  }

  // Parse structured onboarding preferences
  let onboardingPreferences: UserPreferenceData | undefined;
  if (userPreferenceRecord) {
    const rawAnswers = userPreferenceRecord.moodPreferences as any;
    const genreWeights = (userPreferenceRecord.genreWeights as string[]) || [];
    const eras = (userPreferenceRecord.preferredEras as string[]) || [];
    const rawThemes = (userPreferenceRecord.themeWeights as string[]) || [];

    // Extract answered dimensions
    let pacing = rawAnswers?.pacing || "";
    let protagonist = rawAnswers?.protagonist || "";
    let atmosphere = rawAnswers?.atmosphere || "";
    let payoff = rawAnswers?.payoff || "";
    let experience = rawAnswers?.experience || (userPreferenceRecord.preferredSources?.[0] || "");

    if (!pacing) {
      const pTheme = rawThemes.find((t: string) => t.startsWith("pacing:"));
      if (pTheme) pacing = pTheme.replace("pacing:", "");
    }
    if (!protagonist) {
      const prTheme = rawThemes.find((t: string) => t.startsWith("protagonist:"));
      if (prTheme) protagonist = prTheme.replace("protagonist:", "");
    }
    if (!atmosphere) {
      const atTheme = rawThemes.find((t: string) => t.startsWith("atmosphere:"));
      if (atTheme) atmosphere = atTheme.replace("atmosphere:", "");
    }
    if (!payoff) {
      const pyTheme = rawThemes.find((t: string) => t.startsWith("payoff:"));
      if (pyTheme) payoff = pyTheme.replace("payoff:", "");
    }

    onboardingPreferences = {
      genres: genreWeights.length > 0 ? genreWeights : (rawAnswers?.genres || []),
      pacing,
      protagonist,
      atmosphere,
      payoff,
      eras: eras.length > 0 ? eras : (rawAnswers?.eras || []),
      experience,
    };

    // Seed genre preferences directly from onboarding choices
    for (const g of onboardingPreferences.genres) {
      genrePreferences[g] = (genrePreferences[g] || 0) + 1.0;
    }
  }

  return {
    genrePreferences,
    themePreferences,
    interactedAnimeIds: Array.from(interactedAnimeIds),
    dislikedAnimeIds: Array.from(dislikedAnimeIds),
    onboardingPreferences,
  };
}

/**
 * Encodes an anime into a structured feature vector.
 * For MVP, we use a simple multi-hot encoding with metadata normalization.
 */
export function encodeAnimeFeatures(
  anime: Anime & { genres: { genre: Genre }[]; themes: { theme: Theme }[] }
): number[] {
  const vector = new Array(384).fill(0);
  
  // Hash genres to slots (0 - 99)
  anime.genres.forEach((ag) => {
    const slot = ag.genre.id % 100;
    vector[slot] = 1.0;
  });

  // Hash themes to slots (100 - 199)
  anime.themes.forEach((at) => {
    const slot = 100 + (at.theme.id % 100);
    vector[slot] = 1.0;
  });

  // Normalize metadata
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
 * Synthesizes a feature vector directly from onboarding answers.
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

  // Clean and query themes
  const cleanThemes = selectedThemes.map(t => t.replace(/^(pacing|protagonist|atmosphere|payoff):/, ""));
  if (cleanThemes.length > 0) {
    const dbThemes = await prisma.theme.findMany({
      where: { name: { in: cleanThemes, mode: "insensitive" } }
    });
    dbThemes.forEach((t: any) => {
      const slot = 100 + (t.id % 100);
      vector[slot] = 1.0;
    });
  }

  vector[200] = 0.85;
  vector[201] = 0.5;

  return vector;
}
