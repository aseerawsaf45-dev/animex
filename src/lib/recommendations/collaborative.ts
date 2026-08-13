import { prisma } from "../prisma";

export async function getItemItemCollaborativeScores(
  targetAnimeId: number,
  limit: number = 20
): Promise<{ id: number, score: number }[]> {
  // Simple Item-Item CF based on co-occurrence in watchlists
  // In a real production system, this would be pre-calculated in a batch job
  // or use a specialized vector DB. We'll simulate it via raw SQL.
  
  const results = await prisma.$queryRaw<{ animeId: number, cooccurrences: number }[]>`
    SELECT i2."animeId", COUNT(*) as cooccurrences
    FROM "Interaction" i1
    JOIN "Interaction" i2 ON i1."userId" = i2."userId"
    WHERE i1."animeId" = ${targetAnimeId} 
      AND i2."animeId" != ${targetAnimeId}
      AND i1."type" IN ('ADD_TO_WATCHLIST', 'MARK_WATCHED', 'LIKE')
      AND i2."type" IN ('ADD_TO_WATCHLIST', 'MARK_WATCHED', 'LIKE')
    GROUP BY i2."animeId"
    ORDER BY cooccurrences DESC
    LIMIT ${limit}
  `;

  if (!results.length) return [];

  // Normalize scores (0 to 1) based on max co-occurrences
  const maxCooccurrences = results[0].cooccurrences;
  
  return results.map(r => ({
    id: r.animeId,
    score: Number(r.cooccurrences) / Number(maxCooccurrences)
  }));
}

export async function getUserBasedCollaborativeScores(
  userId: string,
  limit: number = 20
): Promise<{ id: number, score: number }[]> {
  // Find users with similar taste, then recommend what they liked
  const results = await prisma.$queryRaw<{ animeId: number, score: number }[]>`
    WITH UserLikes AS (
      SELECT "animeId" FROM "Interaction" 
      WHERE "userId" = ${userId} AND "type" IN ('LIKE', 'ADD_TO_WATCHLIST', 'MARK_WATCHED')
    ),
    SimilarUsers AS (
      SELECT i."userId", COUNT(*) as similarity
      FROM "Interaction" i
      JOIN UserLikes ul ON i."animeId" = ul."animeId"
      WHERE i."userId" != ${userId} AND i."type" IN ('LIKE', 'ADD_TO_WATCHLIST', 'MARK_WATCHED')
      GROUP BY i."userId"
      ORDER BY similarity DESC
      LIMIT 10
    )
    SELECT i."animeId", SUM(su.similarity) as score
    FROM "Interaction" i
    JOIN SimilarUsers su ON i."userId" = su."userId"
    LEFT JOIN UserLikes ul ON i."animeId" = ul."animeId"
    WHERE ul."animeId" IS NULL -- Exclude already liked
      AND i."type" IN ('LIKE', 'ADD_TO_WATCHLIST', 'MARK_WATCHED')
    GROUP BY i."animeId"
    ORDER BY score DESC
    LIMIT ${limit}
  `;

  if (!results.length) return [];
  
  const maxScore = results[0].score;
  return results.map(r => ({
    id: r.animeId,
    score: Number(r.score) / Number(maxScore)
  }));
}
