"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Flame, Moon, Brain, Coffee, Smile, Heart, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimeCard } from "@/components/anime/AnimeCard";

export interface MoodOption {
  id: string;
  label: string;
  icon: any;
  genre: string;
  tagline: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  { id: "epic", label: "EPIC", icon: Flame, genre: "Action", tagline: "High energy battles & grand conflicts" },
  { id: "dark", label: "DARK", icon: Moon, genre: "Psychological", tagline: "Suspense, horror & moral ambiguity" },
  { id: "mind-bending", label: "MIND-BENDING", icon: Brain, genre: "Mystery", tagline: "Sci-fi twists & strategic games" },
  { id: "relaxing", label: "RELAXING", icon: Coffee, genre: "Slice of Life", tagline: "Cozy atmosphere & warm stories" },
  { id: "funny", label: "FUNNY", icon: Smile, genre: "Comedy", tagline: "Pure humor & hilarious parodies" },
  { id: "romantic", label: "ROMANTIC", icon: Heart, genre: "Romance", tagline: "Deep chemistry & emotional drama" },
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
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-vermilion" />
        <span className="font-label text-xs uppercase tracking-[0.2em] text-warm-white/70 font-bold">
          WHAT ARE YOU IN THE MOOD FOR?
        </span>
      </div>

      {/* Mood Pills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {MOOD_OPTIONS.map((mood) => {
          const Icon = mood.icon;
          const isSelected = mood.id === selectedId;

          return (
            <button
              key={mood.id}
              onClick={() => setSelectedId(mood.id)}
              className={cn(
                "relative p-3.5 rounded-[16px] glass border transition-all duration-300 text-left flex flex-col justify-between h-24 overflow-hidden group",
                isSelected
                  ? "border-vermilion/60 bg-vermilion/10 shadow-glow"
                  : "border-white/10 hover:border-white/25 hover:bg-white/5"
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeMoodBg"
                  className="absolute inset-0 bg-gradient-to-br from-vermilion/20 via-transparent to-transparent pointer-events-none"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}

              <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isSelected ? "text-vermilion" : "text-warm-white/60")} />
              
              <div>
                <span className={cn("font-label text-xs font-bold uppercase tracking-wider block", isSelected ? "text-warm-white" : "text-warm-white/70")}>
                  {mood.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Feedback Banner */}
      <div className="p-4 rounded-xl glass border border-white/10 flex items-center justify-between text-xs font-body">
        <span className="text-warm-white/60">
          Selected Vibe: <span className="text-vermilion font-bold">{selectedMood.label}</span> — {selectedMood.tagline}
        </span>
        {loading && (
          <span className="flex items-center gap-1.5 text-[10px] font-label uppercase tracking-widest text-vermilion">
            <Loader2 className="w-3 h-3 animate-spin" /> Loading...
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
        <div className="text-center py-12">
          <p className="font-jp text-4xl opacity-[0.06] select-none mb-2">空</p>
          <p className="text-warm-white/40 font-body text-sm">No anime found for this mood yet.</p>
        </div>
      )}
    </div>
  );
}
