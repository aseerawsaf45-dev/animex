"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check, ArrowRight, Brain, Flame, Compass } from "lucide-react";
import { MatchScoreRing, RecommendationDNABars } from "@/components/recommendations/MatchScoreRing";
import Link from "next/link";
import { EASE_EXPO } from "@/lib/motion";

interface WhyPickedModalProps {
  anime: any;
  explanation?: any;
  isOpen: boolean;
  onClose: () => void;
}

export function WhyPickedModal({ anime, explanation, isOpen, onClose }: WhyPickedModalProps) {
  if (!isOpen || !anime) return null;

  const title = anime.title?.english || anime.title?.romaji || anime.titleEnglish || anime.titleRomaji || "Anime Title";
  const cover = anime.coverImage?.large || anime.coverImage?.medium || anime.coverImage || anime.bannerImage;
  const matchScore = explanation?.matchPercentage || anime.averageScore || 94;

  const sameVibe = explanation?.sameVibe || ["Dark Atmosphere", "Moral Ambiguity", "Intense Conflict"];
  const differentStory = explanation?.differentStory || ["Slower Psychological Focus", "Historical Setting"];
  const reasons = explanation?.reasons || [
    "Vector match for Action & Psychological themes.",
    "High completion rate among viewers with your taste DNA.",
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* 27 — Cinematic Page Blur Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-ink/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.4, ease: EASE_EXPO }}
          className="relative w-full max-w-2xl glass rounded-[28px] border border-white/15 p-6 md:p-8 shadow-2xl overflow-hidden z-10 my-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center text-warm-white/60 hover:text-warm-white hover:border-white/30 transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Anime Poster + Match Ring */}
            <div className="relative shrink-0 w-36 md:w-44 aspect-[2/3] rounded-[18px] overflow-hidden border border-white/10 shadow-lg bg-charcoal">
              {cover && <img src={cover} alt={title} className="w-full h-full object-cover" />}
              <div className="absolute top-3 left-3 z-10">
                <MatchScoreRing score={matchScore} size={48} strokeWidth={4} />
              </div>
            </div>

            {/* Content Details */}
            <div className="flex-1 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-vermilion" />
                  <span className="font-label text-[11px] text-vermilion uppercase tracking-[0.2em] font-bold">
                    {explanation?.contextualBadge || "AI Recommendation"}
                  </span>
                </div>
                <h2 className="font-headline text-2xl md:text-3xl font-bold text-warm-white leading-tight">
                  {title}
                </h2>
                <p className="font-body text-xs text-warm-white/50 mt-1">
                  {explanation?.contextualCopy || "Matches the exact energy of your top favorites."}
                </p>
              </div>

              {/* 05 — Reasons List */}
              <div className="space-y-2">
                <span className="font-label text-[10px] uppercase tracking-widest text-warm-white/40 font-bold block">
                  Why AnimeX Picked This
                </span>
                <ul className="space-y-1.5">
                  {reasons.map((r: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs font-body text-warm-white/80">
                      <Check className="w-4 h-4 text-vermilion shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 06 — Same Vibe vs Different Story */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                  <span className="font-label text-[10px] uppercase tracking-widest text-vermilion font-bold block">
                    Same Vibe
                  </span>
                  {sameVibe.map((v: string) => (
                    <p key={v} className="text-[11px] font-body text-warm-white/70 flex items-center gap-1.5">
                      <span className="text-vermilion font-bold">✓</span> {v}
                    </p>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                  <span className="font-label text-[10px] uppercase tracking-widest text-warm-white/50 font-bold block">
                    Different Story
                  </span>
                  {differentStory.map((d: string) => (
                    <p key={d} className="text-[11px] font-body text-warm-white/60 flex items-center gap-1.5">
                      <span className="text-warm-white/40 font-bold">→</span> {d}
                    </p>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href={`/anime/${anime.id}`}
                  className="flex-1 h-12 rounded-xl gradient-vermilion text-white font-label text-xs uppercase tracking-widest shadow-glow flex items-center justify-center gap-2 font-bold hover:opacity-95 transition-opacity"
                >
                  <span>Explore Anime</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
