import { FadeIn } from "@/components/motion/FadeIn";
import { AnimeCard } from "@/components/anime/AnimeCard";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Star, Plus, Play, Sparkles, ChevronDown } from "lucide-react";
import Link from "next/link";
import { WatchlistDetailButtons } from "@/components/anime/WatchlistDetailButtons";

import { prisma } from "@/lib/prisma";
import { getAnimeById, getTrendingAnime } from "@/lib/anilist";

async function getAnime(id: string): Promise<any> {
  try {
    const aniListAnime = await getAnimeById(Number(id));
    if (aniListAnime) return aniListAnime;
    
    const numericId = parseInt(id, 10);
    if (!isNaN(numericId)) {
      const dbAnime = await prisma.anime.findUnique({
        where: { id: numericId },
        include: { genres: { include: { genre: true } } }
      });
      if (dbAnime) {
        return {
          ...dbAnime,
          title: { english: dbAnime.titleEnglish, romaji: dbAnime.titleRomaji },
          description: dbAnime.synopsis,
          coverImage: { large: dbAnime.coverImage },
          genres: dbAnime.genres.map(g => g.genre.name),
        };
      }
    }
    return null;
  } catch {
    return null;
  }
}

import { auth } from "@/auth";

async function getSimilar(id: string, currentGenres: string[] = []): Promise<any[]> {
  try {
    const numericId = parseInt(id, 10);
    // Find anime with overlapping genres first
    if (currentGenres.length > 0 && !isNaN(numericId)) {
      const dbSimilar = await prisma.anime.findMany({
        where: {
          NOT: { id: numericId },
          genres: {
            some: {
              genre: {
                name: { in: currentGenres, mode: "insensitive" }
              }
            }
          }
        },
        orderBy: { averageScore: "desc" },
        take: 6,
        include: { genres: { include: { genre: true } } }
      });

      if (dbSimilar.length > 0) {
        return dbSimilar.map((db) => ({
          ...db,
          title: { english: db.titleEnglish, romaji: db.titleRomaji },
          coverImage: { large: db.coverImage },
        })).slice(0, 5);
      }
    }

    const trending = await getTrendingAnime(1, 6);
    if (trending && trending.length > 0) {
      return trending.filter((a: any) => String(a.id) !== id).slice(0, 5);
    }

    const dbFallback = await prisma.anime.findMany({
      where: { NOT: { id: Number(id) } },
      orderBy: { averageScore: "desc" },
      take: 6,
      include: { genres: { include: { genre: true } } }
    });
    return dbFallback.map((db) => ({
      ...db,
      title: { english: db.titleEnglish, romaji: db.titleRomaji },
      coverImage: { large: db.coverImage },
    })).filter((a: any) => String(a.id) !== id).slice(0, 5);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const anime = await getAnime(id);
  if (!anime) return { title: "Anime Not Found" };
  const title = anime.title?.english || anime.title?.romaji;
  return {
    title,
    description: anime.description?.replace(/<[^>]+>/g, "").slice(0, 160),
    openGraph: { title, images: [anime.coverImage?.large] },
  };
}

export default async function AnimeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const anime = await getAnime(id);
  const session = await auth();

  let userPref: any = null;
  if (session?.user?.id) {
    userPref = await prisma.userPreference.findUnique({
      where: { userId: session.user.id }
    });
  }

  const rawGenres: string[] = (anime?.genres || []).map((g: any) => typeof g === "string" ? g : g.genre?.name || "").filter(Boolean);
  const similar = await getSimilar(id, rawGenres);

  if (!anime) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center pt-20">
        <p className="font-jp text-7xl opacity-10 mb-6">見つからない</p>
        <h1 className="font-headline text-3xl font-bold mb-3">Anime Not Found</h1>
        <p className="text-warm-white/40 font-body">This story could not be found.</p>
      </div>
    );
  }

  const title = anime.title?.english || anime.title?.romaji;
  const genres = rawGenres;
  const cleanDesc = anime.description?.replace(/<br>/g, "\n").replace(/<[^>]+>/g, "") || "";

  // Dynamic user match calculation
  const userGenres: string[] = (userPref?.genreWeights as string[]) || [];
  const matchedUserGenres = genres.filter(g => userGenres.some(ug => ug.toLowerCase() === g.toLowerCase()));
  const genreAffinityPercent = userGenres.length > 0
    ? Math.round(Math.min(99, Math.max(50, (matchedUserGenres.length / userGenres.length) * 50 + 49)))
    : 85;

  const baseMatchScore = Math.min(98, Math.max(78, (anime.averageScore ? anime.averageScore : 82) + (matchedUserGenres.length > 0 ? 6 : 0)));

  return (
    <div className="min-h-screen flex flex-col font-body">
      {/* Background Decorative Text */}
      <div aria-hidden="true" className="absolute opacity-[0.04] text-[15vw] whitespace-nowrap pointer-events-none z-0 font-headline text-warm-white top-[10%] left-[-5%]">
        {anime.title?.native || "アニメ"}
      </div>

      <main className="flex-grow z-10">
        {/* ─── Hero Section ─── */}
        <section className="relative h-[65vh] w-full flex flex-col justify-end">
          <div className="absolute inset-0 z-0">
            <img
              alt={title}
              className="w-full h-full object-cover"
              src={anime.bannerImage || anime.coverImage?.large}
              style={{ filter: "brightness(0.5) saturate(0.8)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-transparent"></div>
          </div>
          
          <div className="relative z-10 page-container pb-12 w-full flex flex-col items-start gap-4">
            <FadeIn>
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-vermilion/30 rounded-full px-4 py-1.5 shadow-glow mb-2">
                <span className="w-2 h-2 rounded-full bg-vermilion animate-pulse"></span>
                <span className="font-label text-xs tracking-wider uppercase text-white/90">
                  {baseMatchScore}% MATCH — {userPref?.onboardingDone ? "Based on your taste profile" : "Community Discovery Pick"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline italic text-white/40 text-xl tracking-widest mb-1">
                  {anime.title?.native}
                </span>
                <h1 className="font-headline text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight shadow-sm">
                  {title}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-4 font-label text-sm text-white/70 tracking-wide mt-2">
                <span>{anime.seasonYear || "N/A"}</span>
                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                <span>{anime.episodes ? `${anime.episodes} Episodes` : "—"}</span>
                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                <span>{anime.status?.replace(/_/g, " ") || "—"}</span>
                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                <div className="flex items-center gap-1 text-vermilion font-bold bg-vermilion/10 px-2 py-0.5 rounded-sm">
                  <Star className="w-3.5 h-3.5" fill="currentColor" />
                  {anime.averageScore ? (anime.averageScore / 10).toFixed(1) : "N/A"}
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className="flex flex-wrap gap-2 font-label text-xs uppercase tracking-wider">
                  {genres.map(g => (
                    <span key={g} className="px-3 py-1 bg-white/5 border border-white/10 rounded-sm text-white/80">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <WatchlistDetailButtons animeId={Number(anime.id)} />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ─── Content Grid Layout ─── */}
        <div className="page-container py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">
          {/* Left Column: Main Info (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            <FadeIn>
              <section>
                <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
                  <h2 className="font-headline text-2xl font-bold text-white">Synopsis</h2>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full font-label text-xs text-white/60 tracking-wider">
                    {anime.source || "Original"}
                  </span>
                </div>
                <div className="font-body text-white/70 leading-relaxed text-lg font-light space-y-4">
                  {cleanDesc.split('\n').map((paragraph: string, idx: number) => (
                    paragraph.trim() && <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </section>
            </FadeIn>

            <FadeIn delay={0.1}>
              <section className="bg-surface-raised border-l-4 border-vermilion rounded-r-xl p-8 shadow-card relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-vermilion/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <h3 className="font-headline text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                  <Sparkles className="w-5 h-5 text-vermilion" fill="currentColor" />
                  Why we recommend this for you
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-vermilion mt-2 shrink-0"></span>
                    <p className="font-body text-white/80 text-sm">
                      {matchedUserGenres.length > 0
                        ? `Matches your preference for ${matchedUserGenres.slice(0, 2).join(" & ")} storytelling`
                        : `Features compelling ${genres.slice(0, 2).join(" / ") || "narrative"} elements`}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-vermilion mt-2 shrink-0"></span>
                    <p className="font-body text-white/80 text-sm">
                      Pacing calibrated for <strong className="text-white">{userPref?.moodPreferences?.pacing || "immersive progression"}</strong>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-vermilion mt-2 shrink-0"></span>
                    <p className="font-body text-white/80 text-sm">
                      Highly rated in your <strong className="text-white">taste DNA cohort</strong>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-vermilion mt-2 shrink-0"></span>
                    <p className="font-body text-white/80 text-sm">
                      Top score for <strong className="text-white">{genres[0] || 'Anime'} {genres[1] ? `/ ${genres[1]}` : ''}</strong>
                    </p>
                  </div>
                </div>
              </section>
            </FadeIn>
          </div>

          {/* Right Column: Sidebar (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <FadeIn delay={0.2}>
              <div className="glass rounded-2xl p-6 shadow-elevated">
                <h3 className="font-headline text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-white/50" />
                  Taste Breakdown
                </h3>
                <div className="space-y-5">
                  {[
                    { label: "Story & Theme Match", score: `${baseMatchScore}%`, width: `${baseMatchScore}%`, color: "bg-warm-white" },
                    { label: "Viewer Community Score", score: `${Math.min(95, baseMatchScore - 4)}%`, width: `${Math.min(95, baseMatchScore - 4)}%`, color: "bg-vermilion" },
                    { label: "Genre Preference Match", score: `${genreAffinityPercent}%`, width: `${genreAffinityPercent}%`, color: "bg-warm-white" }
                  ].map((insight) => (
                    <div key={insight.label}>
                      <div className="flex justify-between text-xs font-label text-white/70 uppercase tracking-wide mb-2">
                        <span>{insight.label}</span>
                        <span className={insight.color === "bg-vermilion" ? "text-vermilion font-bold" : "text-white font-bold"}>{insight.score}</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${insight.color} rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]`} style={{ width: insight.width }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.25}>
              <div className="bg-surface-raised rounded-xl p-6 shadow-card">
                <h3 className="font-headline text-lg font-bold text-white mb-4 border-b border-white/5 pb-2">Information</h3>
                <ul className="space-y-4 font-body text-sm">
                  {[
                    { label: "Format", value: anime.format?.replace(/_/g, " ") || "TV Series" },
                    { label: "Source", value: anime.source || "Manga" },
                    { label: "Season", value: `${anime.season || ''} ${anime.seasonYear || ''}`.trim() || "N/A" },
                    { label: "Episodes", value: anime.episodes || "—" }
                  ].map((info) => (
                    <li key={info.label} className="flex flex-col gap-1">
                      <span className="font-label text-xs text-white/40 uppercase tracking-wider">{info.label}</span>
                      <span className="text-white/90">{info.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* ─── Similar Anime ─── */}
        {similar.length > 0 && (
          <div className="page-container mb-24">
            <FadeIn>
              <div className="mb-8">
                <p className="font-jp text-[10px] text-warm-white/25 tracking-[0.4em] uppercase mb-1">関連作品</p>
                <h2 className="font-headline text-2xl font-bold">You Might Also Like</h2>
              </div>
            </FadeIn>
            <Stagger className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
              {similar.map((a: any, i: number) => (
                <StaggerItem key={a.id}>
                  <AnimeCard anime={a} index={i} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        )}
      </main>
    </div>
  );
}
