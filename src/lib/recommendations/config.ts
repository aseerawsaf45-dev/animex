export const RECS_CONFIG = {
  // Weights for hybrid scoring
  weights: {
    contentSimilarity: 0.6,
    collaborativeScore: 0.3,
    popularityBias: 0.1,
  },
  
  // Vector extraction settings
  features: {
    genreWeight: 2.0,
    themeWeight: 1.5,
    studioWeight: 1.0,
    formatWeight: 0.5,
    demographicWeight: 1.2,
  },
  
  // Decay parameters for older interactions
  timeDecay: {
    halfLifeDays: 30,
  },

  // Event interaction scores (implicit feedback)
  interactionScores: {
    VIEW_DETAIL: 1.0,
    ADD_TO_WATCHLIST: 3.0,
    MARK_WATCHED: 4.0,
    LIKE: 5.0,
    DISLIKE: -5.0,
  }
};
