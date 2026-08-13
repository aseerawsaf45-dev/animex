import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { WatchStatus } from "@prisma/client";
import { FadeIn } from "@/components/motion/FadeIn";
import { AnimeCard } from "@/components/anime/AnimeCard";
import Link from "next/link";
import { Compass, Bookmark, Check } from "lucide-react";

const TABS = [
  { label: "Plan to Watch", status: "PLAN_TO_WATCH", icon: Bookmark },
  { label: "Completed", status: "COMPLETED", icon: Check },
];

export default async function WatchlistPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login?from=/watchlist");

  const { tab = "Plan to Watch" } = await searchParams;

  // Map tab label to database status
  const activeTab = TABS.find((t) => t.label === tab) || TABS[0];
  const dbStatus = activeTab.status as WatchStatus;

  // Fetch real watchlist data from PostgreSQL
  const userAnimeEntries = await prisma.userAnime.findMany({
    where: {
      userId: session.user.id,
      status: dbStatus,
    },
    include: {
      anime: {
        include: {
          genres: { include: { genre: true } },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Normalize anime data for AnimeCard compatibility
  const items = userAnimeEntries.map((entry) => {
    const a = entry.anime;
    return {
      id: a.id,
      title: { english: a.titleEnglish, romaji: a.titleRomaji },
      coverImage: { large: a.coverImage },
      bannerImage: a.bannerImage,
      genres: a.genres.map((g: any) => g.genre.name),
      averageScore: a.averageScore,
      episodes: a.episodes,
      status: a.status,
      seasonYear: a.seasonYear,
      _userStatus: entry.status,
    };
  });

  // Count totals for each tab
  const counts = await prisma.userAnime.groupBy({
    by: ["status"],
    where: { userId: session.user.id },
    _count: true,
  });
  const countMap: Record<string, number> = {};
  counts.forEach((c) => {
    countMap[c.status] = c._count;
  });

  return (
    <div className="pt-28 pb-20">
      <div className="page-container">
        <FadeIn>
          <div className="mb-10">
            <p className="font-jp text-[10px] text-warm-white/30 tracking-[0.4em] uppercase mb-2">ウォッチリスト</p>
            <h1 className="font-headline text-4xl md:text-5xl font-bold mb-6">My Watchlist</h1>

            {/* Tabs */}
            <div className="flex gap-1 p-1 glass rounded-[14px] w-fit">
              {TABS.map((t) => {
                const Icon = t.icon;
                const count = countMap[t.status] || 0;
                return (
                  <a
                    key={t.label}
                    href={`/watchlist?tab=${encodeURIComponent(t.label)}`}
                    className={`px-5 py-2.5 rounded-[10px] font-label text-[11px] uppercase tracking-wider transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                      tab === t.label
                        ? "gradient-vermilion text-white shadow-glow"
                        : "text-warm-white/40 hover:text-warm-white"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {t.label}
                    {count > 0 && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                        tab === t.label ? "bg-white/20" : "bg-white/10"
                      }`}>
                        {count}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </FadeIn>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {items.map((anime: any, i: number) => (
              <AnimeCard
                key={anime.id}
                anime={anime}
                index={i}
                initialStatus={anime._userStatus}
              />
            ))}
          </div>
        ) : (
          <FadeIn delay={0.2}>
            <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
              <p className="font-jp text-7xl opacity-[0.06] select-none">空</p>
              <div className="space-y-2">
                <h2 className="font-headline text-2xl font-bold">
                  {activeTab.label === "Completed"
                    ? "No Completed Anime Yet"
                    : "Your Watchlist is Empty"}
                </h2>
                <p className="text-warm-white/40 font-body">
                  {activeTab.label === "Completed"
                    ? "Mark anime as completed to track your journey."
                    : "Bookmark anime to save them for later."}
                </p>
              </div>
              <Link
                href="/discover"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full gradient-vermilion text-white font-label text-[12px] uppercase tracking-widest shadow-glow hover:shadow-glow-lg transition-shadow"
              >
                <Compass className="w-4 h-4" /> Discover Anime
              </Link>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
