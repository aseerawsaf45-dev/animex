import type { FeatureVector } from "./vectors";

export function cosineSimilarity(vecA: FeatureVector, vecB: FeatureVector): number {
  let dotProduct = 0;
  
  // Find the smaller vector to optimize the loop
  const keysA = Object.keys(vecA);
  const keysB = Object.keys(vecB);
  
  const [smaller, larger] = keysA.length < keysB.length 
    ? [vecA, vecB] 
    : [vecB, vecA];

  for (const key in smaller) {
    if (larger.hasOwnProperty(key)) {
      dotProduct += smaller[key] * larger[key];
    }
  }

  // Vectors are pre-normalized, so dot product is the cosine similarity
  // However, if they weren't, we'd divide by (magA * magB)
  return dotProduct;
}

export function calculateContentScores(
  targetVector: FeatureVector, 
  candidates: { id: number, vector: FeatureVector }[]
): { id: number, score: number }[] {
  return candidates.map(candidate => ({
    id: candidate.id,
    score: cosineSimilarity(targetVector, candidate.vector)
  }));
}
