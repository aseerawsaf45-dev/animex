import { z } from "zod";

export const FuzzyDateSchema = z.object({
  year: z.number().nullable().optional(),
  month: z.number().nullable().optional(),
  day: z.number().nullable().optional(),
});

export const AnimeTitleSchema = z.object({
  romaji: z.string(),
  english: z.string().nullable().optional(),
  native: z.string().nullable().optional(),
});

export const CoverImageSchema = z.object({
  extraLarge: z.string().nullable().optional(),
  large: z.string().nullable().optional(),
  medium: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
});

export const TrailerSchema = z.object({
  id: z.string().nullable().optional(),
  site: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
});

export const AniListAnimeSchema = z.object({
  id: z.number(),
  idMal: z.number().nullable().optional(),
  title: AnimeTitleSchema,
  description: z.string().nullable().optional(),
  coverImage: CoverImageSchema.nullable().optional(),
  bannerImage: z.string().nullable().optional(),
  episodes: z.number().nullable().optional(),
  duration: z.number().nullable().optional(),
  status: z.string().nullable().optional(),
  season: z.string().nullable().optional(),
  seasonYear: z.number().nullable().optional(),
  averageScore: z.number().nullable().optional(),
  meanScore: z.number().nullable().optional(),
  popularity: z.number().nullable().optional(),
  genres: z.array(z.string()).nullable().optional(),
  startDate: FuzzyDateSchema.nullable().optional(),
  endDate: FuzzyDateSchema.nullable().optional(),
  trailer: TrailerSchema.nullable().optional(),
  isAdult: z.boolean().nullable().optional(),
  countryOfOrigin: z.string().nullable().optional(),
});

export type AniListAnime = z.infer<typeof AniListAnimeSchema>;

export const AniListSearchResponseSchema = z.object({
  data: z.object({
    Page: z.object({
      pageInfo: z.object({
        total: z.number().nullable().optional(),
        currentPage: z.number().nullable().optional(),
        lastPage: z.number().nullable().optional(),
        hasNextPage: z.boolean().nullable().optional(),
        perPage: z.number().nullable().optional(),
      }),
      media: z.array(AniListAnimeSchema),
    }),
  }),
});

export type AniListSearchResponse = z.infer<typeof AniListSearchResponseSchema>;

export const AniListDetailResponseSchema = z.object({
  data: z.object({
    Media: AniListAnimeSchema,
  }),
});

export type AniListDetailResponse = z.infer<typeof AniListDetailResponseSchema>;
