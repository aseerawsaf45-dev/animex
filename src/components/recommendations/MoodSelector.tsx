"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Flame, Moon, Brain, Coffee, Smile, Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function MoodSelector({
  onSelectMood,
  activeMoodId,
}: {
  onSelectMood?: (mood: MoodOption) => void;
  activeMoodId?: string;
}) {
  const [selectedId, setSelectedId] = useState(activeMoodId || "dark");

  const handleSelect = (mood: MoodOption) => {
    setSelectedId(mood.id);
    if (onSelectMood) onSelectMood(mood);
  };

  const selectedMood = MOOD_OPTIONS.find((m) => m.id === selectedId) || MOOD_OPTIONS[1];

  return (
    <div className="space-y-4">
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
              onClick={() => handleSelect(mood)}
              className={cn(
                "relative p-3.5 rounded-[16px] glass border transition-all duration-300 text-left flex flex-col justify-between h-24 overflow-hidden group",
                isSelected
                  ? "border-vermilion/60 bg-vermilion/10 shadow-glow"
                  : "border-white/10 hover:border-white/25 hover:bg-white/5"
              )}
            >
              {/* Active Sliding Background Pill */}
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
        <span className="text-[10px] font-label uppercase tracking-widest text-warm-white/40">
          Reranking Picks...
        </span>
      </div>
    </div>
  );
}
