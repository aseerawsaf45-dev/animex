import { RECS_CONFIG } from "./config";

export function generateExplanation(
  breakdown: { contentScore: number, collabScore: number, popScore: number },
  animeTitle: string
): string {
  if (breakdown.contentScore === 0 && breakdown.collabScore === 0) {
    return `Recommended because ${animeTitle} is highly popular right now.`;
  }

  // Determine dominant factor
  const contentWeighted = breakdown.contentScore * RECS_CONFIG.weights.contentSimilarity;
  const collabWeighted = breakdown.collabScore * RECS_CONFIG.weights.collaborativeScore;

  if (contentWeighted > collabWeighted) {
    if (breakdown.contentScore > 0.8) {
      return `A near-perfect match for your specific taste in genres and themes.`;
    }
    return `Matches the genres and themes of anime you've enjoyed recently.`;
  } else {
    if (breakdown.collabScore > 0.8) {
      return `Highly rated by viewers with very similar taste to yours.`;
    }
    return `People who watch the same anime as you also enjoyed this.`;
  }
}
