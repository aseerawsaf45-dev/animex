"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimeCard } from "@/components/anime/AnimeCard";
import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { cn } from "@/lib/utils";

const SEASONS = [
  { value: "WINTER", label: "Winter", jp: "冬" },
  { value: "SPRING", label: "Spring", jp: "春" },
  { value: "SUMMER", label: "Summer", jp: "夏" },
  { value: "FALL",   label: "Fall",   jp: "秋" },
];

const now = new Date();
const CURRENT_YEAR = now.getFullYear();
const CURRENT_SEASON = ["WINTER","WINTER","WINTER","SPRING","SPRING","SPRING","SUMMER","SUMMER","SUMMER","FALL","FALL","FALL"][now.getMonth()];

export default function SeasonalPage() {
  const [season, setSeason] = useState(CURRENT_SEASON);
  const [year] = useState(CURRENT_YEAR);
  const [anime, setAnime] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchSeason(s: string) {
    setSeason(s);
    setLoading(true);
    try {
      const res = await fetch(`/api/anime/seasonal?season=${s}&year=${year}&perPage=40`);
      const data = await res.json();
      setAnime(data.data || []);
    } catch {
      setAnime([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSeason(CURRENT_SEASON);
  }, []);

  return (
    <div className="pt-28 pb-20">
      <div className="page-container">
        <FadeIn>
          <p className="font-jp text-[10px] text-warm-white/30 tracking-[0.4em] uppercase mb-2">季節のアニメ</p>
          <h1 className="font-headline text-5xl md:text-7xl font-bold mb-2 tracking-tight">
            {SEASONS.find(s => s.value === season)?.label} {year}
          </h1>
          <p className="font-jp text-xl text-warm-white/25 mb-10">
            {SEASONS.find(s => s.value === season)?.jp}アニメ
          </p>
        </FadeIn>

        {/* Season tabs */}
        <FadeIn delay={0.1}>
          <div className="flex gap-2 mb-12 p-1 glass rounded-[14px] w-fit">
            {SEASONS.map((s) => (
              <button
                key={s.value}
                onClick={() => fetchSeason(s.value)}
                className={cn(
                  "px-6 py-2.5 rounded-[10px] font-label text-[11px] uppercase tracking-widest transition-all duration-200",
                  season === s.value
                    ? "gradient-vermilion text-white shadow-glow"
                    : "text-warm-white/40 hover:text-warm-white"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </FadeIn>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-[14px] bg-surface animate-pulse" />
            ))}
          </div>
        ) : anime.length > 0 ? (
          <Stagger className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {anime.map((a: any, i: number) => (
              <StaggerItem key={a.id}>
                <AnimeCard anime={a} index={i} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <div className="text-center py-32 text-warm-white/30 font-body">
            <p className="font-jp text-4xl mb-4 opacity-30">空</p>
            <p>Click a season tab to load anime.</p>
          </div>
        )}
      </div>
    </div>
  );
}
