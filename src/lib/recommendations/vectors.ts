import { RECS_CONFIG } from "./config";
import type { Anime } from "@prisma/client";

export type FeatureVector = Record<string, number>;

export function createAnimeVector(anime: any): FeatureVector {
  const vector: FeatureVector = {};

  // Genres
  if (anime.genres && Array.isArray(anime.genres)) {
    for (const ag of anime.genres) {
      if (ag.genre && ag.genre.name) {
        vector[`genre_${ag.genre.name}`] = RECS_CONFIG.features.genreWeight;
      }
    }
  }

  // Tags/Themes
  if (anime.tags && Array.isArray(anime.tags)) {
    for (const at of anime.tags) {
      if (at.tag && at.tag.name) {
        // Factor in the tag rank if available, else use base weight
        const rankMultiplier = at.rank ? at.rank / 100 : 1;
        vector[`tag_${at.tag.name}`] = RECS_CONFIG.features.themeWeight * rankMultiplier;
      }
    }
  }

  // Format (TV, MOVIE, etc.)
  if (anime.format) {
    vector[`format_${anime.format}`] = RECS_CONFIG.features.formatWeight;
  }

  // Season + Year proximity could be a feature, but typically 
  // we handle that in post-processing or exact matches.

  // Normalize the vector so its length is 1 (L2 normalization)
  let sumSquares = 0;
  for (const val of Object.values(vector)) {
    sumSquares += val * val;
  }
  
  const magnitude = Math.sqrt(sumSquares);
  if (magnitude > 0) {
    for (const key in vector) {
      vector[key] = vector[key] / magnitude;
    }
  }

  return vector;
}

export function createUserVector(interactions: any[]): FeatureVector {
  const vector: FeatureVector = {};
  const now = new Date().getTime();

  for (const interaction of interactions) {
    // Only process interactions with anime data
    if (!interaction.anime) continue;

    const animeVector = createAnimeVector(interaction.anime);
    const score = RECS_CONFIG.interactionScores[interaction.type as keyof typeof RECS_CONFIG.interactionScores] || 0;
    
    // Apply time decay
    const ageDays = (now - new Date(interaction.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    const decay = Math.pow(0.5, ageDays / RECS_CONFIG.timeDecay.halfLifeDays);
    
    const finalScore = score * decay;

    // Add weighted anime vector to user vector
    for (const [feature, value] of Object.entries(animeVector)) {
      vector[feature] = (vector[feature] || 0) + (value * finalScore);
    }
  }

  // Normalize user vector
  let sumSquares = 0;
  for (const val of Object.values(vector)) {
    sumSquares += val * val;
  }
  
  const magnitude = Math.sqrt(sumSquares);
  if (magnitude > 0) {
    for (const key in vector) {
      vector[key] = vector[key] / magnitude;
    }
  }

  return vector;
}
