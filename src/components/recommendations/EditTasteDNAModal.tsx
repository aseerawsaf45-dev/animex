"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Check,
  Zap,
  Brain,
  Compass,
  Drama,
  Flame,
  Sword,
  Coffee,
  Moon,
  Shield,
  Award,
  HeartHandshake,
  Dna,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror",
  "Mystery", "Psychological", "Romance", "Sci-Fi", "Slice of Life",
  "Sports", "Supernatural", "Thriller"
];

const PACING_OPTIONS = [
  { id: "fast", label: "Fast-Paced Adrenaline", desc: "Non-stop battles & rapid progression", icon: Zap },
  { id: "slow-burn", label: "Slow-Burn Psychological", desc: "Layered mysteries & deep tension", icon: Brain },
  { id: "episodic", label: "Episodic Exploration", desc: "Unique standalone adventures each arc", icon: Compass },
  { id: "character-drama", label: "Character-Driven Drama", desc: "Intense relationships & emotional depth", icon: Drama },
];

const PROTAGONIST_OPTIONS = [
  { id: "underdog", label: "Underdog with Grit", desc: "Overcomes impossible odds through willpower", icon: Flame },
  { id: "anti-hero", label: "Morally Ambiguous Anti-Hero", desc: "Crosses ethical lines for conviction", icon: Sword },
  { id: "strategist", label: "Mastermind Strategist", desc: "Outsmarts enemies in high-IQ chess battles", icon: Brain },
  { id: "relatable", label: "Everyday Protagonist", desc: "Down-to-earth person navigating strange worlds", icon: Coffee },
];

const ATMOSPHERE_OPTIONS = [
  { id: "cyberpunk", label: "Cyberpunk Dystopia", desc: "Neon lights, high tech & dark rain", icon: Moon },
  { id: "fantasy", label: "High Fantasy & Magic", desc: "Ancient kingdoms, mythical beasts & spells", icon: Shield },
  { id: "military", label: "Gritty Realistic Military", desc: "Tactical warfare, politics & harsh survival", icon: Sword },
  { id: "cozy", label: "Cozy Slice of Life", desc: "Warm coffee, peaceful days & gentle humor", icon: Coffee },
];

const PAYOFF_OPTIONS = [
  { id: "twists", label: "Mind-Shattering Twists", desc: "Plot twists that redefine everything", icon: Brain },
  { id: "tears", label: "Bittersweet Catharsis", desc: "Emotional tears & profound poetic endings", icon: HeartHandshake },
  { id: "hype", label: "Pure Hype Victory", desc: "Climactic sakuga animation & triumphant battles", icon: Award },
  { id: "peace", label: "Comfort & Peace", desc: "Heartwarming closure that leaves you smiling", icon: Coffee },
];

const ERAS = [
  { label: "Retro Classics (90s & earlier)", desc: "Celluloid aesthetics & cyberpunk roots", value: "90s" },
  { label: "Golden Era (2000s)", desc: "Hand-drawn epics & iconic shonen classics", value: "2000s" },
  { label: "Modern Greats (2010s)", desc: "High-octane digital compositing & masterpieces", value: "2010s" },
  { label: "Bleeding Edge (2020s)", desc: "Raytraced sakuga & hybrid 3D/2D innovations", value: "2020s" },
];

const EXPERIENCE = [
  { label: "Beginner", desc: "Just starting my journey", value: "beginner" },
  { label: "Casual", desc: "Watched a few popular series", value: "casual" },
  { label: "Regular", desc: "Watch weekly seasons", value: "regular" },
  { label: "Veteran", desc: "Deep knowledge & hundreds of titles", value: "veteran" },
];

interface EditTasteDNAModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPreferences?: any;
  onSaved: (updatedPref: any) => void;
}

export function EditTasteDNAModal({
  isOpen,
  onClose,
  initialPreferences,
  onSaved,
}: EditTasteDNAModalProps) {
  const [tab, setTab] = useState<"genres" | "narrative" | "eras">("genres");

  const rawAnswers = initialPreferences?.moodPreferences || {};
  const [genres, setGenres] = useState<string[]>(
    (initialPreferences?.genreWeights as string[]) || rawAnswers.genres || []
  );
  const [pacing, setPacing] = useState<string>(rawAnswers.pacing || "");
  const [protagonist, setProtagonist] = useState<string>(rawAnswers.protagonist || "");
  const [atmosphere, setAtmosphere] = useState<string>(rawAnswers.atmosphere || "");
  const [payoff, setPayoff] = useState<string>(rawAnswers.payoff || "");
  const [eras, setEras] = useState<string[]>(
    (initialPreferences?.preferredEras as string[]) || rawAnswers.eras || []
  );
  const [experience, setExperience] = useState<string>(
    rawAnswers.experience || initialPreferences?.preferredSources?.[0] || "casual"
  );
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleGenre = (val: string) =>
    setGenres((prev) => (prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]));

  const toggleEra = (val: string) =>
    setEras((prev) => (prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: {
            genres,
            pacing,
            protagonist,
            atmosphere,
            payoff,
            eras,
            experience,
          },
          onboardingCompleted: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data?.data) {
        onSaved(data.data);
        setSavedSuccess(true);
        setTimeout(() => {
          setSavedSuccess(false);
          onClose();
        }, 800);
      }
    } catch (err) {
      console.error("Failed to save taste DNA:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur & Ambient Glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-[28px] glass-card border border-white/15 shadow-2xl overflow-hidden bg-ink/95 z-10"
          >
            {/* Japanese Background Kanji Watermark */}
            <div className="absolute top-8 right-6 font-jp text-[120px] font-bold text-white/[0.03] select-none pointer-events-none -z-10 leading-none">
              調律
            </div>

            {/* Modal Header */}
            <div className="p-6 sm:p-8 pb-4 border-b border-white/10 flex items-center justify-between shrink-0 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl gradient-vermilion flex items-center justify-center text-white shadow-glow border border-white/20">
                  <Dna className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-jp text-[10px] text-vermilion tracking-[0.25em] font-bold">
                      ベクター調整
                    </span>
                    <span className="text-white/20 text-xs">•</span>
                    <span className="font-mono text-[10px] text-warm-white/40 uppercase tracking-wider">
                      ANIME PROFILE SYNTHESIZER
                    </span>
                  </div>
                  <h3 className="font-headline text-2xl sm:text-3xl font-bold text-warm-white tracking-tight">
                    Calibrate Anime Taste DNA
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center text-warm-white/60 hover:text-warm-white hover:border-white/25 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 sm:px-8 pt-4 pb-2 border-b border-white/5 flex gap-3 shrink-0 relative z-10 overflow-x-auto hide-scrollbar">
              {[
                { id: "genres", label: "01. Genres Spectrum", icon: Sparkles },
                { id: "narrative", label: "02. Story Dimensions", icon: Sliders },
                { id: "eras", label: "03. Era & Experience", icon: Award },
              ].map((t) => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id as any)}
                    className={cn(
                      "px-4 py-2 rounded-xl font-label text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 shrink-0",
                      active
                        ? "gradient-vermilion text-white shadow-glow"
                        : "text-warm-white/50 hover:text-warm-white hover:bg-white/5"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Scrollable Body Content */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-8 relative z-10 custom-scrollbar">
              {/* TAB 1: GENRES */}
              {tab === "genres" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-headline text-lg font-bold text-warm-white">Favorite Genres</h4>
                    <p className="font-body text-xs text-warm-white/50 mt-0.5">
                      Select all genres that calibrate your vector similarity profile.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {GENRES.map((g) => {
                      const selected = genres.includes(g);
                      return (
                        <button
                          key={g}
                          onClick={() => toggleGenre(g)}
                          className={cn(
                            "px-4 py-2.5 rounded-full font-label text-xs uppercase tracking-wider border transition-all duration-200 font-bold flex items-center gap-2",
                            selected
                              ? "gradient-vermilion border-transparent text-white shadow-glow scale-105"
                              : "border-white/10 text-warm-white/60 hover:border-white/25 hover:text-warm-white bg-white/5"
                          )}
                        >
                          {selected && <Check className="w-3 h-3" />}
                          <span>{g}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: NARRATIVE DIMENSIONS */}
              {tab === "narrative" && (
                <div className="space-y-8">
                  {/* Pacing */}
                  <div className="space-y-3">
                    <h4 className="font-headline text-base font-bold text-warm-white">Narrative Pacing</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PACING_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const selected = pacing === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setPacing(opt.id)}
                            className={cn(
                              "p-4 rounded-2xl glass border text-left flex items-start gap-3 transition-all duration-200",
                              selected
                                ? "border-vermilion/80 bg-vermilion/15 shadow-glow"
                                : "border-white/10 hover:border-white/20 hover:bg-white/5"
                            )}
                          >
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", selected ? "gradient-vermilion text-white" : "bg-white/10 text-warm-white/60")}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-label text-xs font-bold uppercase tracking-wider text-warm-white">{opt.label}</p>
                              <p className="font-body text-[11px] text-warm-white/50 mt-0.5">{opt.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Protagonist */}
                  <div className="space-y-3">
                    <h4 className="font-headline text-base font-bold text-warm-white">Protagonist Archetype</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PROTAGONIST_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const selected = protagonist === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setProtagonist(opt.id)}
                            className={cn(
                              "p-4 rounded-2xl glass border text-left flex items-start gap-3 transition-all duration-200",
                              selected
                                ? "border-vermilion/80 bg-vermilion/15 shadow-glow"
                                : "border-white/10 hover:border-white/20 hover:bg-white/5"
                            )}
                          >
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", selected ? "gradient-vermilion text-white" : "bg-white/10 text-warm-white/60")}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-label text-xs font-bold uppercase tracking-wider text-warm-white">{opt.label}</p>
                              <p className="font-body text-[11px] text-warm-white/50 mt-0.5">{opt.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Atmosphere */}
                  <div className="space-y-3">
                    <h4 className="font-headline text-base font-bold text-warm-white">Atmosphere & Setting</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ATMOSPHERE_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const selected = atmosphere === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setAtmosphere(opt.id)}
                            className={cn(
                              "p-4 rounded-2xl glass border text-left flex items-start gap-3 transition-all duration-200",
                              selected
                                ? "border-vermilion/80 bg-vermilion/15 shadow-glow"
                                : "border-white/10 hover:border-white/20 hover:bg-white/5"
                            )}
                          >
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", selected ? "gradient-vermilion text-white" : "bg-white/10 text-warm-white/60")}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-label text-xs font-bold uppercase tracking-wider text-warm-white">{opt.label}</p>
                              <p className="font-body text-[11px] text-warm-white/50 mt-0.5">{opt.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Payoff */}
                  <div className="space-y-3">
                    <h4 className="font-headline text-base font-bold text-warm-white">Finale Payoff</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PAYOFF_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const selected = payoff === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setPayoff(opt.id)}
                            className={cn(
                              "p-4 rounded-2xl glass border text-left flex items-start gap-3 transition-all duration-200",
                              selected
                                ? "border-vermilion/80 bg-vermilion/15 shadow-glow"
                                : "border-white/10 hover:border-white/20 hover:bg-white/5"
                            )}
                          >
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", selected ? "gradient-vermilion text-white" : "bg-white/10 text-warm-white/60")}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-label text-xs font-bold uppercase tracking-wider text-warm-white">{opt.label}</p>
                              <p className="font-body text-[11px] text-warm-white/50 mt-0.5">{opt.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ERAS & EXPERIENCE */}
              {tab === "eras" && (
                <div className="space-y-8">
                  {/* Eras */}
                  <div className="space-y-3">
                    <h4 className="font-headline text-base font-bold text-warm-white">Aesthetic Era Preferences</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ERAS.map((e) => {
                        const selected = eras.includes(e.value);
                        return (
                          <button
                            key={e.value}
                            onClick={() => toggleEra(e.value)}
                            className={cn(
                              "p-4 rounded-2xl glass border text-left transition-all duration-200",
                              selected
                                ? "border-vermilion/80 bg-vermilion/15 shadow-glow"
                                : "border-white/10 hover:border-white/20 hover:bg-white/5"
                            )}
                          >
                            <p className="font-label text-xs font-bold uppercase tracking-wider text-warm-white flex items-center justify-between">
                              <span>{e.label}</span>
                              {selected && <Check className="w-3.5 h-3.5 text-vermilion" />}
                            </p>
                            <p className="font-body text-[11px] text-warm-white/50 mt-0.5">{e.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-3">
                    <h4 className="font-headline text-base font-bold text-warm-white">Anime Experience Level</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {EXPERIENCE.map((exp) => {
                        const selected = experience === exp.value;
                        return (
                          <button
                            key={exp.value}
                            onClick={() => setExperience(exp.value)}
                            className={cn(
                              "p-4 rounded-2xl glass border text-left transition-all duration-200",
                              selected
                                ? "border-vermilion/80 bg-vermilion/15 shadow-glow"
                                : "border-white/10 hover:border-white/20 hover:bg-white/5"
                            )}
                          >
                            <p className="font-label text-xs font-bold uppercase tracking-wider text-warm-white flex items-center justify-between">
                              <span>{exp.label}</span>
                              {selected && <Check className="w-3.5 h-3.5 text-vermilion" />}
                            </p>
                            <p className="font-body text-[11px] text-warm-white/50 mt-0.5">{exp.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 sm:p-8 pt-4 border-t border-white/10 flex items-center justify-between shrink-0 bg-white/[0.02]">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl glass border border-white/10 text-warm-white/60 hover:text-warm-white hover:border-white/25 font-label text-xs uppercase tracking-wider font-bold transition-all"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving || savedSuccess}
                className="px-7 py-3 rounded-xl gradient-vermilion text-white font-label text-xs uppercase tracking-widest font-bold shadow-glow flex items-center gap-2 hover:opacity-95 transition-all disabled:opacity-50"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>DNA Recalibrated!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{saving ? "Updating Vector DNA..." : "Save & Recalculate"}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
