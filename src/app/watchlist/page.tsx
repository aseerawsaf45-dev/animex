import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FadeIn } from "@/components/motion/FadeIn";
import { AnimeCard } from "@/components/anime/AnimeCard";
import Link from "next/link";
import { Compass } from "lucide-react";

const TABS = ["Watching", "Plan to Watch", "Completed", "Dropped"];

export default async function WatchlistPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login?from=/watchlist");

  const { tab = "Plan to Watch" } = await searchParams;
  // In production: fetch from DB filtered by status
  const items: any[] = [];

  return (
    <div className="pt-28 pb-20">
      <div className="page-container">
        <FadeIn>
          <div className="mb-10">
            <p className="font-jp text-[10px] text-warm-white/30 tracking-[0.4em] uppercase mb-2">ウォッチリスト</p>
            <h1 className="font-headline text-4xl md:text-5xl font-bold mb-6">My Watchlist</h1>

            {/* Tabs */}
            <div className="flex gap-1 p-1 glass rounded-[14px] w-fit">
              {TABS.map((t) => (
                <a
                  key={t}
                  href={`/watchlist?tab=${encodeURIComponent(t)}`}
                  className={`px-5 py-2 rounded-[10px] font-label text-[11px] uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
                    tab === t
                      ? "gradient-vermilion text-white shadow-glow"
                      : "text-warm-white/40 hover:text-warm-white"
                  }`}
                >
                  {t}
                </a>
              ))}
            </div>
          </div>
        </FadeIn>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {items.map((anime: any, i: number) => (
              <AnimeCard key={anime.id} anime={anime} index={i} />
            ))}
          </div>
        ) : (
          <FadeIn delay={0.2}>
            <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
              <p className="font-jp text-7xl opacity-[0.06] select-none">空</p>
              <div className="space-y-2">
                <h2 className="font-headline text-2xl font-bold">Your Watchlist is Empty</h2>
                <p className="text-warm-white/40 font-body">Your next story is waiting.</p>
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
