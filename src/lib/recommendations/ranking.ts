import { CandidateAnime } from "./candidates";
import { UserProfile } from "./features";

export interface RankedRecommendation {
  anime: CandidateAnime;
  score: number;
  breakdown: {
    contentSimilarity: number;
    collaborativeScore: number;
    popularity: number;
    novelty: number;
    genreMatchScore: number;
    themeMatchScore: number;
    eraMatchScore: number;
  };
}

/**
 * Calculates narrative compatibility matching answered questions:
 * - Genres
 * - Pacing (fast vs slow-burn vs episodic vs character-drama)
 * - Protagonist archetype (underdog vs anti-hero vs strategist vs relatable)
 * - Atmosphere (cyberpunk vs fantasy vs military vs cozy)
 * - Payoff (twists vs tears vs hype vs peace)
 * - Eras (90s, 2000s, 2010s, 2020s)
 * - Experience (beginner, casual, regular, veteran)
 */
function calculateQuestionnaireCompatibility(
  anime: CandidateAnime,
  userProfile?: UserProfile
): { genreScore: number; themeScore: number; eraScore: number } {
  if (!userProfile?.onboardingPreferences) {
    return { genreScore: 0.5, themeScore: 0.5, eraScore: 0.5 };
  }

  const prefs = userProfile.onboardingPreferences;
  const animeGenres = (anime.genres || []).map((g) => g.genre.name.toLowerCase());
  const animeThemes = (anime.themes || []).map((t) => t.theme.name.toLowerCase());
  const synopsis = (anime.synopsis || "").toLowerCase();

  // 1. Genre Score
  let genreScore = 0.3;
  if (prefs.genres && prefs.genres.length > 0) {
    const matched = prefs.genres.filter((g) => animeGenres.includes(g.toLowerCase()));
    genreScore = matched.length / Math.max(prefs.genres.length, 1);
  }

  // 2. Theme & Questionnaire Dimensions Score
  let themePoints = 0;
  let totalThemesEvaluated = 0;

  // Pacing
  if (prefs.pacing) {
    totalThemesEvaluated++;
    if (prefs.pacing === "fast" && (animeGenres.includes("action") || animeThemes.includes("shounen") || synopsis.includes("battle") || synopsis.includes("fight"))) {
      themePoints += 1.0;
    } else if (prefs.pacing === "slow-burn" && (animeGenres.includes("psychological") || animeGenres.includes("mystery") || animeThemes.includes("seinen") || synopsis.includes("investigate") || synopsis.includes("conspiracy"))) {
      themePoints += 1.0;
    } else if (prefs.pacing === "episodic" && (animeGenres.includes("adventure") || animeGenres.includes("sci-fi") || animeThemes.includes("space") || synopsis.includes("journey"))) {
      themePoints += 1.0;
    } else if (prefs.pacing === "character-drama" && (animeGenres.includes("drama") || animeGenres.includes("romance") || animeGenres.includes("slice of life") || synopsis.includes("relationship"))) {
      themePoints += 1.0;
    } else {
      themePoints += 0.3;
    }
  }

  // Protagonist Archetype
  if (prefs.protagonist) {
    totalThemesEvaluated++;
    if (prefs.protagonist === "underdog" && (animeThemes.includes("shounen") || animeGenres.includes("sports") || synopsis.includes("training") || synopsis.includes("overcome") || synopsis.includes("weakest"))) {
      themePoints += 1.0;
    } else if (prefs.protagonist === "anti-hero" && (animeGenres.includes("psychological") || synopsis.includes("revenge") || synopsis.includes("dark") || synopsis.includes("assassin") || synopsis.includes("demon"))) {
      themePoints += 1.0;
    } else if (prefs.protagonist === "strategist" && (animeGenres.includes("mystery") || animeGenres.includes("psychological") || animeThemes.includes("military") || synopsis.includes("mind") || synopsis.includes("chess") || synopsis.includes("tactics") || synopsis.includes("intellect"))) {
      themePoints += 1.0;
    } else if (prefs.protagonist === "relatable" && (animeGenres.includes("slice of life") || animeGenres.includes("comedy") || animeGenres.includes("romance") || synopsis.includes("everyday") || synopsis.includes("school"))) {
      themePoints += 1.0;
    } else {
      themePoints += 0.3;
    }
  }

  // Atmosphere
  if (prefs.atmosphere) {
    totalThemesEvaluated++;
    if (prefs.atmosphere === "cyberpunk" && (animeGenres.includes("sci-fi") || animeThemes.includes("cyberpunk") || synopsis.includes("future") || synopsis.includes("cyber") || synopsis.includes("dystopia") || synopsis.includes("ai"))) {
      themePoints += 1.0;
    } else if (prefs.atmosphere === "fantasy" && (animeGenres.includes("fantasy") || animeGenres.includes("supernatural") || animeThemes.includes("isekai") || animeThemes.includes("magic") || synopsis.includes("kingdom") || synopsis.includes("magic"))) {
      themePoints += 1.0;
    } else if (prefs.atmosphere === "military" && (animeThemes.includes("military") || animeThemes.includes("mecha") || animeGenres.includes("action") || synopsis.includes("war") || synopsis.includes("army") || synopsis.includes("soldier"))) {
      themePoints += 1.0;
    } else if (prefs.atmosphere === "cozy" && (animeGenres.includes("slice of life") || animeGenres.includes("comedy") || animeGenres.includes("romance") || synopsis.includes("club") || synopsis.includes("peaceful") || synopsis.includes("cooking"))) {
      themePoints += 1.0;
    } else {
      themePoints += 0.3;
    }
  }

  // Payoff
  if (prefs.payoff) {
    totalThemesEvaluated++;
    if (prefs.payoff === "twists" && (animeGenres.includes("mystery") || animeGenres.includes("psychological") || animeGenres.includes("thriller"))) {
      themePoints += 1.0;
    } else if (prefs.payoff === "tears" && (animeGenres.includes("drama") || animeGenres.includes("romance") || synopsis.includes("tragedy") || synopsis.includes("emotional"))) {
      themePoints += 1.0;
    } else if (prefs.payoff === "hype" && (animeGenres.includes("action") || animeGenres.includes("sports") || animeThemes.includes("super power"))) {
      themePoints += 1.0;
    } else if (prefs.payoff === "peace" && (animeGenres.includes("slice of life") || animeGenres.includes("comedy"))) {
      themePoints += 1.0;
    } else {
      themePoints += 0.3;
    }
  }

  const themeScore = totalThemesEvaluated > 0 ? themePoints / totalThemesEvaluated : 0.5;

  // 3. Era Score
  let eraScore = 0.5;
  if (prefs.eras && prefs.eras.length > 0 && anime.startDate) {
    const year = new Date(anime.startDate).getFullYear();
    let eraMatched = false;
    for (const era of prefs.eras) {
      if (era === "90s" && year < 2000) eraMatched = true;
      if (era === "2000s" && year >= 2000 && year < 2010) eraMatched = true;
      if (era === "2010s" && year >= 2010 && year < 2020) eraMatched = true;
      if (era === "2020s" && year >= 2020) eraMatched = true;
    }
    eraScore = eraMatched ? 1.0 : 0.4;
  }

  return { genreScore, themeScore, eraScore };
}

/**
 * Applies hybrid weighted ranking to the candidate pool based on direct questionnaire answers.
 */
export function rankCandidates(
  candidates: CandidateAnime[],
  userProfile?: UserProfile
): RankedRecommendation[] {
  const maxPopularity = Math.max(...candidates.map((c) => c.popularity || 1));

  const ranked = candidates.map((anime) => {
    // 1. Vector / Content Similarity
    const contentSimilarity = anime._similarity !== undefined ? anime._similarity : 0.2;

    // 2. Direct Questionnaire Compatibility
    const { genreScore, themeScore, eraScore } = calculateQuestionnaireCompatibility(anime, userProfile);

    // 3. Quality & Score factor (Jikan/AniList Average Score)
    const qualityScore = anime.averageScore ? anime.averageScore / 100 : (anime.malScore ? anime.malScore / 10 : 0.75);

    // 4. Popularity vs Veteran/Hidden-Gem adjustment
    const normalizedPop = (anime.popularity || 0) / maxPopularity;
    const experience = userProfile?.onboardingPreferences?.experience || "casual";
    
    // Veteran/Regular users prefer hidden gems and quality over pure hype popularity
    let popScore = normalizedPop;
    if (experience === "veteran") {
      popScore = 1.0 - (normalizedPop * 0.4); // Boost gems
    } else if (experience === "beginner") {
      popScore = normalizedPop; // Beginners enjoy top known entry titles
    }

    // 5. Recency / Novelty
    const novelty = anime.startDate && new Date(anime.startDate).getFullYear() >= new Date().getFullYear() - 2 ? 0.8 : 0.3;

    // Collaborative Baseline
    const collaborativeScore = 0.3;

    // Multi-factor hybrid weighted composition (High weight to Questionnaire Answers & Genre/Theme compatibility)
    const score =
      (genreScore * 0.35) +
      (themeScore * 0.25) +
      (contentSimilarity * 0.15) +
      (qualityScore * 0.10) +
      (eraScore * 0.08) +
      (popScore * 0.04) +
      (novelty * 0.03);

    return {
      anime,
      score,
      breakdown: {
        contentSimilarity,
        collaborativeScore,
        popularity: popScore,
        novelty,
        genreMatchScore: genreScore,
        themeMatchScore: themeScore,
        eraMatchScore: eraScore,
      },
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
