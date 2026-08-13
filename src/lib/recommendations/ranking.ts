import { CandidateAnime } from "./candidates";

export interface RankedRecommendation {
  anime: CandidateAnime;
  score: number;
  breakdown: {
    contentSimilarity: number;
    collaborativeScore: number;
    popularity: number;
    novelty: number;
  };
}

/**
 * Applies hybrid weighted ranking to the candidate pool.
 */
export function rankCandidates(
  candidates: CandidateAnime[],
  userProfile: any // Type this appropriately based on features.ts
): RankedRecommendation[] {
  // Normalize factors
  const maxPopularity = Math.max(...candidates.map(c => c.popularity || 1));

  const ranked = candidates.map(anime => {
    // 1. Content Similarity (0 - 1.0)
    const contentSimilarity = anime._similarity !== undefined ? anime._similarity : 0.1;

    // 2. Collaborative Score (0 - 1.0)
    const collaborativeScore = 0.2;

    // 3. Popularity (0 - 1.0)
    const popularity = (anime.popularity || 0) / maxPopularity;

    // 4. Novelty / Recency (0 - 1.0)
    const novelty = anime.startDate && new Date(anime.startDate).getFullYear() >= new Date().getFullYear() - 1 ? 0.8 : 0.2;

    // Hybrid weighting: prioritize vector similarity heavily when present
    const score = 
      (contentSimilarity * 0.65) + 
      (collaborativeScore * 0.15) + 
      (popularity * 0.10) + 
      (novelty * 0.10);

    return {
      anime,
      score,
      breakdown: { contentSimilarity, collaborativeScore, popularity, novelty }
    };
  });

  return ranked.sort((a, b) => b.score - a.score);
}

/**
 * Maximum Marginal Relevance (MMR) for diversity.
 * Penalizes candidates that are too similar to already selected recommendations.
 */
export function applyDiversityReranking(
  rankedCandidates: RankedRecommendation[],
  limit: number = 20,
  lambda: number = 0.7 // 1.0 = Pure relevance, 0.0 = Pure diversity
): RankedRecommendation[] {
  const selected: RankedRecommendation[] = [];
  let remaining = [...rankedCandidates];

  while (selected.length < limit && remaining.length > 0) {
    if (selected.length === 0) {
      // First item is always the one with the highest relevance
      selected.push(remaining[0]);
      remaining.splice(0, 1);
      continue;
    }

    // Find the next item that maximizes MMR
    let maxMMRScore = -Infinity;
    let bestIndex = -1;

    for (let i = 0; i < Math.min(remaining.length, 50); i++) {
      const candidate = remaining[i];
      
      // Calculate redundancy (max similarity to already selected items)
      let maxRedundancy = 0;
      for (const sel of selected) {
        // Placeholder similarity: Jaccard on genres
        const sim = calculateGenreSimilarity(candidate.anime, sel.anime);
        if (sim > maxRedundancy) {
          maxRedundancy = sim;
        }
      }

      // MMR Formula: lambda * Relevance - (1 - lambda) * Redundancy
      const mmrScore = (lambda * candidate.score) - ((1 - lambda) * maxRedundancy);

      if (mmrScore > maxMMRScore) {
        maxMMRScore = mmrScore;
        bestIndex = i;
      }
    }

    if (bestIndex !== -1) {
      selected.push(remaining[bestIndex]);
      remaining.splice(bestIndex, 1);
    } else {
      break;
    }
  }

  return selected;
}

function calculateGenreSimilarity(a: CandidateAnime, b: CandidateAnime): number {
  const setA = new Set(a.genres.map(g => g.genre.name));
  const setB = new Set(b.genres.map(g => g.genre.name));
  
  if (setA.size === 0 || setB.size === 0) return 0;
  
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  
  return intersection.size / union.size;
}
