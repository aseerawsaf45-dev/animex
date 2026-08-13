import { AnimeCard } from "@/components/anime/AnimeCard";
import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Search, Compass, Sparkles, Filter } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { searchAnime, getTrendingAnime } from "@/lib/anilist";

export const dynamic = "force-dynamic";

async function getResults(q: string, genre: string) {
  try {
    if (q) {
      // Search local DB
      const dbResults = await prisma.anime.findMany({
        where: {
          OR: [
            { titleRomaji: { contains: q, mode: "insensitive" } },
            { titleEnglish: { contains: q, mode: "insensitive" } },
            { synopsis: { contains: q, mode: "insensitive" } },
          ],
          ...(genre && {
            genres: { some: { genre: { name: { equals: genre, mode: "insensitive" } } } }
          })
        },
        take: 400,
        orderBy: { popularity: "desc" },
        include: {
          genres: { include: { genre: true } },
          themes: { include: { theme: true } },
        }
      });

      if (dbResults.length > 0) return dbResults;

      // Fallback to API search if DB has no matches
      const apiResults = await searchAnime(q, 1, 50);
      return apiResults;
    }

    if (genre) {
      const dbResults = await prisma.anime.findMany({
        where: {
          genres: { some: { genre: { name: { equals: genre, mode: "insensitive" } } } }
        },
        take: 400,
        orderBy: { popularity: "desc" },
        include: {
          genres: { include: { genre: true } },
          themes: { include: { theme: true } },
        }
      });
      if (dbResults.length > 0) return dbResults;
    }

    // Default: fetch ALL 350+ anime from local database
    const dbResults = await prisma.anime.findMany({
      take: 500,
      orderBy: { popularity: "desc" },
      include: {
        genres: { include: { genre: true } },
        themes: { include: { theme: true } },
      }
    });

    if (dbResults.length > 0) return dbResults;

    return await getTrendingAnime(1, 50);
  } catch {
    return [];
  }
}

const GENRES = ["Action","Adventure","Comedy","Drama","Fantasy","Horror","Mystery","Psychological","Romance","Sci-Fi","Slice of Life","Sports","Supernatural","Thriller"];

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; genre?: string }>;
}) {
  const { q = "", genre = "" } = await searchParams;
  const results = await getResults(q, genre);
  const totalDbCount = await prisma.anime.count().catch(() => results.length);

  return (
    <div className="pt-28 pb-24">
      <div className="page-container">
        {/* Header Hero Banner */}
        <FadeIn>
          <div className="relative rounded-[28px] overflow-hidden p-10 md:p-14 mb-12 cinematic-gradient border border-white/[0.08] shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-vermilion/10 via-transparent to-transparent" />
            <div className="japanese-deco text-[140px] md:text-[220px] font-bold leading-none top-1/2 -translate-y-1/2 right-[-2%] opacity-10 pointer-events-none select-none">
              発見
            </div>

            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 rounded-full bg-vermilion animate-ping" />
                <span className="font-label text-[11px] text-vermilion uppercase tracking-[0.25em] font-semibold">
                  Dual API Catalog — AniList & MyAnimeList
                </span>
              </div>
              <h1 className="font-ninja text-5xl md:text-7xl font-bold mb-4 tracking-tight text-warm-white leading-[1.05]">
                Discover More Anime
              </h1>
              <p className="font-body text-warm-white/60 text-lg leading-relaxed mb-6">
                Browse our complete database of <span className="text-vermilion font-semibold">{totalDbCount || 350}+ titles</span> enriched with vector embeddings, Jikan scores, and AniList GraphQL metadata.
              </p>

              <div className="flex items-center gap-4 pt-2">
                <div className="px-4 py-2 rounded-full glass border border-white/10 text-xs font-label uppercase tracking-widest text-warm-white/70 flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-vermilion" /> {results.length} Titles Loaded
                </div>
                <div className="px-4 py-2 rounded-full glass border border-white/10 text-xs font-label uppercase tracking-widest text-warm-white/70 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-vermilion" /> Vector Indexed
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Search Bar */}
        <FadeIn delay={0.1}>
          <form action="/discover" method="GET" className="relative mb-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-white/40 pointer-events-none" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search across 350+ anime by title, character, or keyword..."
              className="w-full h-16 pl-16 pr-6 rounded-[20px] glass border border-white/10 focus:border-vermilion/60 bg-surface/50 text-warm-white placeholder:text-warm-white/30 font-body text-[16px] outline-none transition-all duration-300 shadow-lg focus:shadow-glow"
            />
          </form>
        </FadeIn>

        {/* Genre Pill Filters */}
        <FadeIn delay={0.15}>
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-3.5 h-3.5 text-vermilion" />
              <span className="font-label text-[11px] text-warm-white/40 uppercase tracking-widest">Filter by Genre</span>
            </div>
            <div className="flex gap-2.5 flex-wrap">
              <a
                href="/discover"
                className={`px-5 py-2 rounded-full font-label text-[11px] uppercase tracking-widest border transition-all duration-200 ${
                  !genre
                    ? "gradient-vermilion border-transparent text-white shadow-glow"
                    : "glass border-white/10 text-warm-white/50 hover:border-white/25 hover:text-warm-white"
                }`}
              >
                All Genres
              </a>
              {GENRES.map((g) => (
                <a
                  key={g}
                  href={`/discover?genre=${encodeURIComponent(g)}`}
                  className={`px-5 py-2 rounded-full font-label text-[11px] uppercase tracking-widest border transition-all duration-200 ${
                    genre === g
                      ? "gradient-vermilion border-transparent text-white shadow-glow"
                      : "glass border-white/10 text-warm-white/50 hover:border-white/25 hover:text-warm-white"
                  }`}
                >
                  {g}
                </a>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Anime Catalog Grid */}
        {results.length > 0 ? (
          <>
            <FadeIn delay={0.2}>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.06]">
                <p className="font-label text-[12px] text-warm-white/40 uppercase tracking-widest flex items-center gap-2">
                  {q ? (
                    <>Showing <span className="text-vermilion font-bold">{results.length}</span> results for "{q}"</>
                  ) : genre ? (
                    <>Showing <span className="text-vermilion font-bold">{results.length}</span> {genre} Anime</>
                  ) : (
                    <>Displaying All <span className="text-vermilion font-bold">{results.length}</span> Catalog Titles</>
                  )}
                </p>
              </div>
            </FadeIn>

            <Stagger className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {results.map((anime: any, i: number) => (
                <StaggerItem key={`disc-${anime.id}-${i}`}>
                  <AnimeCard anime={anime} index={i} />
                </StaggerItem>
              ))}
            </Stagger>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-4 glass rounded-[24px] border border-white/10 my-8">
            <p className="font-jp text-6xl opacity-20">見つからない</p>
            <h3 className="font-headline text-3xl font-bold">No Results Found</h3>
            <p className="text-warm-white/40 font-body max-w-md">
              We couldn't find any anime matching "{q}". Try searching for another title or clear your filters.
            </p>
            <a
              href="/discover"
              className="mt-4 px-6 py-2.5 rounded-full gradient-vermilion text-white font-label text-[11px] uppercase tracking-widest shadow-glow"
            >
              Reset All Filters
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
