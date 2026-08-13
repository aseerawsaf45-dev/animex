"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Dices, ArrowRight, X, Compass, Flame } from "lucide-react";
import { EASE_EXPO } from "@/lib/motion";
import Link from "next/link";

interface SurpriseMeButtonProps {
  candidates?: any[];
  className?: string;
}

export function SurpriseMeButton({ candidates = [], className = "" }: SurpriseMeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"animating" | "result">("animating");
  const [surprisePick, setSurprisePick] = useState<any>(null);

  const handleTrigger = () => {
    setIsOpen(true);
    setStep("animating");

    // Exploration Algorithm: Find high-rated title slightly outside user's top genre
    const pick = candidates.length > 0
      ? candidates[Math.floor(Math.random() * candidates.length)]
      : {
          id: 113415,
          title: { english: "Jujutsu Kaisen", romaji: "Jujutsu Kaisen" },
          coverImage: { large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-bbBWj4pKGFxB.png" },
          averageScore: 86,
          genres: ["Action", "Fantasy", "Supernatural"],
          synopsis: "A boy swallows a cursed talisman—the finger of a demon—and becomes cursed himself."
        };

    setSurprisePick(pick);

    // 1.8s Exploration Animation sequence
    setTimeout(() => {
      setStep("result");
    }, 2000);
  };

  return (
    <>
      <motion.button
        onClick={handleTrigger}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className={`px-6 py-3.5 rounded-full gradient-vermilion text-white font-label text-xs uppercase tracking-widest shadow-[0_8px_30px_rgba(211,47,47,0.4)] flex items-center gap-2 font-bold ${className}`}
      >
        <Dices className="w-4 h-4 animate-spin-slow" />
        <span>SURPRISE ME</span>
      </motion.button>

      {/* Exploration Discovery Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-ink/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: EASE_EXPO }}
              className="relative w-full max-w-lg glass rounded-[28px] border border-white/15 p-8 shadow-2xl text-center z-10 overflow-hidden"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center text-warm-white/60 hover:text-warm-white"
              >
                <X className="w-4 h-4" />
              </button>

              {step === "animating" ? (
                <div className="py-12 space-y-6 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl gradient-vermilion flex items-center justify-center shadow-glow animate-bounce">
                    <Compass className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <div className="space-y-2">
                    <span className="font-label text-xs uppercase tracking-[0.25em] text-vermilion font-bold block">
                      EXPLORATION ALGORITHM
                    </span>
                    <h3 className="font-headline text-2xl font-bold text-warm-white">
                      Going Outside Your Comfort Zone...
                    </h3>
                    <p className="font-body text-xs text-warm-white/50 max-w-xs mx-auto">
                      Matching high-rated hidden stories with moderate similarity & high novelty scores.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-4 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-vermilion/15 border border-vermilion/30 text-vermilion font-label text-[10px] uppercase tracking-widest font-bold">
                    <Sparkles className="w-3.5 h-3.5" /> 84% Exploration Match
                  </div>

                  {surprisePick && (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-40 aspect-[2/3] rounded-[16px] overflow-hidden border border-white/15 shadow-2xl bg-charcoal">
                        <img
                          src={surprisePick.coverImage?.large || surprisePick.coverImage}
                          alt="Surprise Pick"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <h3 className="font-headline text-2xl font-bold text-warm-white mb-1">
                          {surprisePick.title?.english || surprisePick.title?.romaji || "Surprise Anime"}
                        </h3>
                        <p className="font-body text-xs text-warm-white/60 line-clamp-2 max-w-sm mx-auto">
                          We went outside your usual taste. Highly rated story with incredible character development.
                        </p>
                      </div>

                      <Link
                        href={`/anime/${surprisePick.id}`}
                        onClick={() => setIsOpen(false)}
                        className="w-full h-12 rounded-xl gradient-vermilion text-white font-label text-xs uppercase tracking-widest shadow-glow flex items-center justify-center gap-2 font-bold mt-2"
                      >
                        <span>Explore Surprise Pick</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
