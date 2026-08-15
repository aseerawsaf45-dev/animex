"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Flame, Moon, Brain, Coffee, Smile, Heart, Sparkles, Loader2, Compass, ShieldAlert, Zap, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimeCard } from "@/components/anime/AnimeCard";

export interface MoodOption {
  id: string;
  label: string;
  jp: string;
  icon: any;
  genre: string;
  tagline: string;
  color: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  { id: "epic", label: "Sakuga & Epic", jp: "激闘", icon: Flame, genre: "Action", tagline: "High-octane battles & adrenaline climaxes", color: "from-vermilion/25 to-crimson/10" },
  { id: "dark", label: "Psychological Dark", jp: "深淵", icon: Moon, genre: "Psychological", tagline: "Suspense, 4D mind games & moral ambiguity", color: "from-purple-900/30 to-black/20" },
  { id: "mind-bending", label: "Mind-Bending", jp: "超常", icon: Brain, genre: "Mystery", tagline: "Sci-fi timeline twists & strategic puzzles", color: "from-blue-900/30 to-black/20" },
  { id: "relaxing", label: "Cozy & Healing", jp: "癒し", icon: Coffee, genre: "Slice of Life", tagline: "Warm coffee, peaceful sunsets & gentle moments", color: "from-amber-900/25 to-black/20" },
  { id: "funny", label: "Pure Comedy", jp: "爆笑", icon: Smile, genre: "Comedy", tagline: "Absurd laughs, comedic timing & parody gold", color: "from-yellow-900/25 to-black/20" },
  { id: "romantic", label: "Romance & Drama", jp: "純愛", icon: Heart, genre: "Romance", tagline: "Heartfelt relationships & tear-inducing payoffs", color: "from-pink-900/30 to-black/20" },
];

export function MoodSelector() {
  const [selectedId, setSelectedId] = useState("epic");
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedMood = MOOD_OPTIONS.find((m) => m.id === selectedId) || MOOD_OPTIONS[0];

  // Fetch anime filtered by mood genre
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`/api/anime/search?genre=${encodeURIComponent(selectedMood.genre)}&perPage=8`)
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => {
        if (!cancelled) {
          setAnimeList(data.data || []);
        }
      })
      .catch(() => {
        if (!cancelled) setAnimeList([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [selectedMood.genre]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-vermilion flex items-center justify-center text-white shadow-glow">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="font-label text-[10px] text-vermilion uppercase tracking-[0.25em] font-bold block">
              REAL-TIME VIBE CALIBRATOR
            </span>
            <h3 className="font-headline text-2xl font-bold text-warm-white">
              What Are You in the Mood For?
            </h3>
          </div>
        </div>

        <span className="hidden sm:inline-block font-mono text-[10px] text-warm-white/40 uppercase tracking-widest">
          LIVE FILTER // 6 MOOD NODES
        </span>
      </div>

      {/* Mood Tiles Grid with Luxury Glassmorphism */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
        {MOOD_OPTIONS.map((mood) => {
          const Icon = mood.icon;
          const isSelected = mood.id === selectedId;

          return (
            <button
              key={mood.id}
              onClick={() => setSelectedId(mood.id)}
              className={cn(
                "relative p-4 rounded-[20px] glass border transition-all duration-300 text-left flex flex-col justify-between h-28 overflow-hidden group cursor-pointer",
                isSelected
                  ? "border-vermilion/80 bg-vermilion/15 shadow-glow-lg -translate-y-1"
                  : "border-white/8 hover:border-white/20 hover:bg-white/[0.03] hover:-translate-y-0.5"
              )}
            >
              {/* Background Gradient Mesh */}
              {isSelected && (
                <motion.div
                  layoutId="activeMoodBg"
                  className={cn("absolute inset-0 bg-gradient-to-br pointer-events-none", mood.color)}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}

              {/* Top Row: Icon + Japanese Kanji */}
              <div className="flex items-center justify-between w-full relative z-10">
                <div className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300",
                  isSelected ? "gradient-vermilion text-white shadow-glow" : "bg-white/10 text-warm-white/60 group-hover:text-warm-white group-hover:scale-105"
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={cn("font-jp text-xs font-bold transition-colors", isSelected ? "text-vermilion" : "text-white/20")}>
                  {mood.jp}
                </span>
              </div>
              
              {/* Bottom Label */}
              <div className="relative z-10">
                <span className={cn("font-label text-xs font-bold uppercase tracking-wider block truncate", isSelected ? "text-warm-white" : "text-warm-white/70 group-hover:text-warm-white")}>
                  {mood.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Feedback Banner */}
      <div className="p-4 rounded-2xl glass border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-body shadow-lg">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-vermilion shrink-0" />
          <span className="text-warm-white/70">
            Active Channel: <strong className="text-warm-white font-semibold">{selectedMood.label}</strong> — <span className="text-warm-white/50">{selectedMood.tagline}</span>
          </span>
        </div>
        {loading && (
          <span className="flex items-center gap-1.5 text-[10px] font-label uppercase tracking-widest text-vermilion font-bold shrink-0">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Calibrating...
          </span>
        )}
      </div>

      {/* Mood-Filtered Anime Grid */}
      {!loading && animeList.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {animeList.map((anime: any, i: number) => (
            <AnimeCard key={anime.id} anime={anime} index={i} />
          ))}
        </div>
      )}

      {!loading && animeList.length === 0 && (
        <div className="text-center py-12 glass rounded-2xl border border-white/5">
          <p className="font-jp text-4xl opacity-[0.08] select-none mb-2">空</p>
          <p className="text-warm-white/40 font-body text-sm">No titles found for this frequency currently.</p>
        </div>
      )}
    </div>
  );
}

