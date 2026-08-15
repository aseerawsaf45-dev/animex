# AnimeX — Recommendation Engine & Data Ingestion Architecture

This document provides a comprehensive technical and conceptual breakdown of **how AnimeX fetches anime data** and **how the personalized recommendation system calculates matches**.

---

## 1. How Anime Data is Fetched & Synchronized

AnimeX uses a **hybrid database-caching architecture** powered by PostgreSQL (Prisma ORM) and the official **AniList GraphQL API**.

```
  +-----------------------------------------------------------+
  |                     AniList GraphQL API                   |
  |     (Catalog, Episodes, Covers, Genres, Studios, Tags)    |
  +-----------------------------------------------------------+
                                |
                                v
               [ Periodic Sync & On-Demand Ingestion ]
                                |
                                v
  +-----------------------------------------------------------+
  |              PostgreSQL (Neon DB with pgvector)           |
  |                                                           |
  |  • Anime (ID, titles, synopsis, popularity, score)        |
  |  • Genres & Themes (Many-to-Many relations)               |
  |  • AnimeEmbedding (384-dimensional semantic vectors)      |
  |  • UserPreference (Taste DNA, pacing, archetypes)         |
  |  • UserEvent & Watchlist (Clicks, watches, ratings)       |
  +-----------------------------------------------------------+
```

### A. AniList GraphQL Ingestion (`src/lib/anilist.ts`)
- **API Endpoint**: `https://graphql.anilist.co`
- **Rate-Limit Resilience**: Implements an automatic exponential backoff handler (`429` detector with jitter retries) to respect AniList limits.
- **Fields Fetched**:
  - `id`, `idMal`
  - Titles (`romaji`, `english`, `native`)
  - Media & Visuals (`coverImage.extraLarge`, `bannerImage`, `trailer`)
  - Release metadata (`season`, `seasonYear`, `episodes`, `status`, `duration`)
  - Community metrics (`averageScore`, `popularity`, `meanScore`)
  - Categorization (`genres`, `tags`, `studios`)

### B. Intelligent Fallback Strategy
1. **Local Database First**: Fast queries to local PostgreSQL table with relational genre/theme joins.
2. **AniList API Fallback**: If a title is not yet cached locally, or during initial discovery browse, fetch directly from AniList and asynchronously upsert into the local database.

---

## 2. How the Recommendation System Works

AnimeX does not rely on static generic "top lists". It uses a **multi-stage hybrid recommendation pipeline**:

```
+--------------------------------------------------------------------------------+
|                             USER TASTE DNA & HISTORY                           |
|  (Questionnaire answers, favorite genres, pacing, protagonist archetypes,      |
|   watchlist history, and positive/negative interactions)                       |
+--------------------------------------------------------------------------------+
                                       |
                                       v
+--------------------------------------------------------------------------------+
| 1. CANDIDATE GENERATION (Pool: 200 titles)                                     |
|  • 60% Semantic Vector Matching (pgvector cosine similarity <=> on 384d stats) |
|  • 25% Genre & Mood Synergy (Direct alignment with answered preferences)       |
|  • 15% Curated Hidden Gems (High score >= 78, moderate popularity)             |
+--------------------------------------------------------------------------------+
                                       |
                                       v
+--------------------------------------------------------------------------------+
| 2. MULTI-FACTOR RANKING & SCORING                                              |
|  • Genre Alignment Score      (Weight: 35%)                                    |
|  • Narrative & Pacing Match   (Weight: 25%)                                    |
|  • Semantic Vector Proximity  (Weight: 20%)                                    |
|  • Studio & Era Affinity      (Weight: 10%)                                    |
|  • Quality & Score Baseline   (Weight: 10%)                                    |
+--------------------------------------------------------------------------------+
                                       |
                                       v
+--------------------------------------------------------------------------------+
| 3. DIVERSITY RE-RANKING (Maximal Marginal Relevance - MMR)                     |
|  • Penalizes genre clustering to avoid showing only one franchise/style.       |
|  • Injects surprise discoveries and distinct atmospheres.                      |
+--------------------------------------------------------------------------------+
                                       |
                                       v
+--------------------------------------------------------------------------------+
| 4. EXPLAINABILITY & SECTION MAPPING                                            |
|  • Top Pick: "Your Next Obsession" (Highest affinity title)                    |
|  • "Because You Loved [Anime]" (Contextual anchor)                             |
|  • "Same Vibe. Different Story." (Identical tone, unique setting)              |
|  • "Hidden Gems For You" (High quality, low mainstream saturation)             |
|  • "Real-Time Vibe Calibrator" (Live mood channel filter)                      |
+--------------------------------------------------------------------------------+
```

---

## 3. The 6-Axis Taste Radar Matrix

The Taste Profile maps every viewer onto a 6-axis power radar:

| Stat Axis | Anime Dimension | How it's Calculated |
| :--- | :--- | :--- |
| **Sakuga & Combat** (`激闘`) | High-octane fights & animation | Action, Martial Arts, Shonen, fast pacing |
| **Mind Games & IQ** (`深淵`) | 4D chess, psychological & mystery | Psychological, Mystery, Thriller, strategist MC |
| **Worldbuilding** (`世界`) | Deep lore, geopolitics, fantasy worlds | Fantasy, Sci-Fi, Adventure, slow-burn immersion |
| **Emotional Weight** (`感動`) | Character drama, romance, tearjerkers | Drama, Romance, Slice of Life, heavy payoffs |
| **Supernatural & Magic** (`超常`) | Magic systems, demons, abilities | Supernatural, Magic, Isekai, Mythology |
| **Hype & Climaxes** (`熱狂`) | Adrenaline, sports, tournament arcs | Sports, Mecha, Tournament arcs, underdog MC |

---

## 4. Key Recommendation Files Reference

| File | Purpose |
| :--- | :--- |
| [`src/lib/recommendations/engine.ts`](file:///f:/AnimeX/src/lib/recommendations/engine.ts) | Main coordinator orchestrating candidates, scoring, MMR, and explainability. |
| [`src/lib/recommendations/candidates.ts`](file:///f:/AnimeX/src/lib/recommendations/candidates.ts) | Generates candidate pools using `pgvector` embeddings and relational filters. |
| [`src/lib/recommendations/ranking.ts`](file:///f:/AnimeX/src/lib/recommendations/ranking.ts) | Multi-factor weights scoring and Maximal Marginal Relevance (MMR) diversity reranker. |
| [`src/lib/recommendations/features.ts`](file:///f:/AnimeX/src/lib/recommendations/features.ts) | Converts user events and questionnaire choices into feature preference vectors. |
| [`src/lib/recommendations/explainability.ts`](file:///f:/AnimeX/src/lib/recommendations/explainability.ts) | Generates human-friendly reasons (*"Why we picked this for you"*). |
| [`src/lib/anilist.ts`](file:///f:/AnimeX/src/lib/anilist.ts) | AniList GraphQL client with rate-limit retries and data parsers. |
| [`src/components/recommendations/TasteDNAChart.tsx`](file:///f:/AnimeX/src/components/recommendations/TasteDNAChart.tsx) | Responsive 6-axis SVG visualizer for the user's taste radar. |
| [`src/components/recommendations/MoodSelector.tsx`](file:///f:/AnimeX/src/components/recommendations/MoodSelector.tsx) | Real-time 6-channel mood tuner with glassmorphism tiles. |

---

## 5. Summary of Highlights

1. **No Cold-Start Traps**: New users without history receive tailored picks as soon as they answer the quick 5-question onboarding or select a mood.
2. **Accurate & Diverse**: MMR ensures you don't get 10 iterations of the same franchise.
3. **Transparent Explanations**: Every recommendation explains *why* it was selected (matched genres, pacing, or thematic alignment).
