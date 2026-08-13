import { AnimeCard } from "@/components/anime/AnimeCard";
import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Link from "next/link";

async function getTrending() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/anime/trending?perPage=50`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

export default async function TrendingPage() {
  const anime = await getTrending();

  return (
    <div className="pt-28 pb-20">
      {/* Editorial Hero */}
      <div className="page-container mb-16">
        <FadeIn>
          <p className="font-jp text-[10px] text-warm-white/30 tracking-[0.4em] uppercase mb-2">トレンド</p>
          <h1 className="font-headline text-5xl md:text-7xl font-bold mb-3 tracking-tight">Trending Now</h1>
          <p className="text-warm-white/40 font-body text-lg">What everyone is watching right now.</p>
        </FadeIn>
      </div>

      {/* Top 3 — large editorial cards */}
      {anime.slice(0, 3).length > 0 && (
        <div className="page-container mb-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {anime.slice(0, 3).map((a: any, i: number) => (
            <FadeIn key={a.id} delay={i * 0.1}>
              <Link href={`/anime/${a.id}`} className="group relative block overflow-hidden rounded-[20px]">
                <div className="aspect-[16/9] relative">
                  <img
                    src={a.bannerImage || a.coverImage?.large}
                    alt={a.title?.english || a.title?.romaji}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="font-headline text-5xl font-bold text-vermilion/30 leading-none">#{i + 1}</span>
                  </div>
                  <h2 className="font-headline text-xl font-bold text-white line-clamp-1">
                    {a.title?.english || a.title?.romaji}
                  </h2>
                  <p className="font-label text-[10px] text-warm-white/40 mt-1">
                    {a.genres?.slice(0, 3).join(" · ")}
                  </p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      )}

      {/* Rest — grid */}
      <div className="page-container">
        <FadeIn>
          <p className="font-label text-[11px] text-warm-white/25 uppercase tracking-widest mb-6">More Trending</p>
        </FadeIn>
        <Stagger className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {anime.slice(3).map((a: any, i: number) => (
            <StaggerItem key={a.id}>
              <AnimeCard anime={a} index={i} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  );
}
