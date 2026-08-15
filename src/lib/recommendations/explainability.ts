import { RankedRecommendation } from "./ranking";

export interface ExplainableRecommendation {
  animeId: number;
  score: number;
  matchPercentage: number;
  confidence: number;
  reasons: string[];
  sameVibe: string[];
  differentStory: string[];
  contextualBadge: string;
  contextualCopy: string;
  source: string;
}

/**
 * Translates underlying ML scores into rich human-readable contextual explanations.
 */
export function generateExplanations(
  ranked: RankedRecommendation[],
  userProfile?: any
): ExplainableRecommendation[] {
  const prefs = userProfile?.onboardingPreferences;

  return ranked.map((rec) => {
    const reasons: string[] = [];
    const sameVibe: string[] = [];
    const differentStory: string[] = [];
    
    // Scale match percentage based on multi-factor score
    const rawMatch = rec.score * 100;
    const matchPercentage = Math.min(Math.max(Math.round(rawMatch), 80), 99);
    let confidence = 0.7;

    // Genres extracted from anime
    const genres: string[] = (rec.anime.genres || []).map((g: any) =>
      typeof g === "string" ? g : g.genre?.name || g.name || ""
    ).filter(Boolean);

    // 1. Questionnaire Specific Matches
    if (prefs) {
      if (rec.breakdown.genreMatchScore > 0.5 && prefs.genres?.length > 0) {
        const matchedGenres = genres.filter(g => prefs.genres.some((pg: string) => pg.toLowerCase() === g.toLowerCase()));
        if (matchedGenres.length > 0) {
          reasons.push(`Direct match for your favorite ${matchedGenres.slice(0, 2).join(" & ")} genres.`);
        }
      }

      if (prefs.pacing && rec.breakdown.themeMatchScore > 0.6) {
        const pacingLabels: Record<string, string> = {
          "fast": "Fast-Paced Action & Battles",
          "slow-burn": "Slow-Burn Psychological Tension",
          "episodic": "Episodic World Exploration",
          "character-drama": "Character-Driven Emotional Drama",
        };
        reasons.push(`Pacing calibrated for ${pacingLabels[prefs.pacing] || prefs.pacing}.`);
      }

      if (prefs.protagonist) {
        const protagLabels: Record<string, string> = {
          "underdog": "Underdog protagonist overcoming impossible odds",
          "anti-hero": "Morally complex anti-hero narrative",
          "strategist": "Mastermind tactical battles & high-IQ chess",
          "relatable": "Grounded, relatable character journey",
        };
        sameVibe.push(protagLabels[prefs.protagonist] || "Compelling Protagonist Arc");
      }

      if (prefs.atmosphere) {
        const atmosLabels: Record<string, string> = {
          "cyberpunk": "Cyberpunk Neo-Dystopia",
          "fantasy": "High Fantasy & Magic",
          "military": "Tactical Military Realism",
          "cozy": "Warm Cozy Slice of Life",
        };
        sameVibe.push(atmosLabels[prefs.atmosphere] || "Immersive World Setting");
      }

      if (prefs.eras && prefs.eras.length > 0 && rec.breakdown.eraMatchScore > 0.6) {
        reasons.push(`Aesthetic aligned with your ${prefs.eras.join(", ")} era preference.`);
      }
    }

    // 2. Content & Vector Match Signals
    if (rec.breakdown.contentSimilarity > 0.6) {
      reasons.push(`Vector similarity with your interaction taste DNA.`);
      sameVibe.push(`${genres[0] || "Dark"} Atmosphere`, "High Production Quality");
      confidence += 0.15;
    }

    // 3. Same Vibe vs Different Story generator
    if (genres.includes("Action") || genres.includes("Supernatural")) {
      sameVibe.push("Intense Conflict", "Dynamic Animation");
    }
    if (genres.includes("Psychological") || genres.includes("Mystery")) {
      sameVibe.push("Moral Ambiguity", "Mind Games");
    }

    if (genres.includes("Historical") || genres.includes("Fantasy")) {
      differentStory.push("Unique Worldbuilding Setting");
    }
    if (genres.includes("Drama") || genres.includes("Slice of Life")) {
      differentStory.push("Deeper Character Relationships");
    } else {
      differentStory.push("Distinct Narrative Perspective");
    }

    // 4. Contextual Copy & Badge Tag
    let contextualBadge = "High Match";
    let contextualCopy = "Very close to your taste profile.";

    if (rec.anime.popularity && rec.anime.popularity < 50000 && (rec.anime.averageScore || 0) > 78) {
      contextualBadge = "Hidden Gem";
      contextualCopy = "Highly rated gem tailored to your taste.";
    } else if (rec.breakdown.novelty > 0.6) {
      contextualBadge = "Surprise Pick";
      contextualCopy = "A fresh discovery outside mainstream hype.";
    } else if (rec.breakdown.themeMatchScore > 0.75) {
      contextualBadge = "Taste DNA Match";
      contextualCopy = "Matches the exact answers from your questionnaire.";
    } else if (rec.breakdown.genreMatchScore > 0.7) {
      contextualBadge = "Genre Synergy";
      contextualCopy = "Directly aligns with your preferred storytelling genres.";
    }

    if (reasons.length === 0) {
      reasons.push("Tailored AI discovery pick based on your answered questionnaire.");
    }

    return {
      animeId: rec.anime.id,
      score: rec.score,
      matchPercentage,
      confidence: Math.min(confidence, 1.0),
      reasons: reasons.slice(0, 3),
      sameVibe: Array.from(new Set(sameVibe)).slice(0, 3),
      differentStory: Array.from(new Set(differentStory)).slice(0, 2),
      contextualBadge,
      contextualCopy,
      source: rec.anime._source || "hybrid",
    };
  });
}
