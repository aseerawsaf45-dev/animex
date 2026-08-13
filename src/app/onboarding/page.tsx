"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronRight, Check, Zap, Brain, Compass, Drama, Flame, Sword, Coffee, Moon, Shield, Award, HeartHandshake } from "lucide-react";
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
  { id: "underdog", label: "Underdog with Grit", desc: "Overcomes impossible odds through sheer willpower", icon: Flame },
  { id: "anti-hero", label: "Morally Ambiguous Anti-Hero", desc: "Crosses ethical lines for revenge or conviction", icon: Sword },
  { id: "strategist", label: "Mastermind Strategist", desc: "Outsmarts enemies in 4D chess battles", icon: Brain },
  { id: "relatable", label: "Everyday Protagonist", desc: "Down-to-earth person navigating extraordinary worlds", icon: Coffee },
];

const ATMOSPHERE_OPTIONS = [
  { id: "cyberpunk", label: "Cyberpunk Dystopia", desc: "Neon lights, high tech & dark rain", icon: Moon },
  { id: "fantasy", label: "High Fantasy & Magic", desc: "Ancient kingdoms, mythical beasts & spells", icon: Shield },
  { id: "military", label: "Gritty Realistic Military", desc: "Tactical warfare, politics & harsh survival", icon: Sword },
  { id: "cozy", label: "Cozy Slice of Life", desc: "Warm coffee, peaceful days & gentle humor", icon: Coffee },
];

const PAYOFF_OPTIONS = [
  { id: "twists", label: "Mind-Shattering Twists", desc: "Plot twists that redefine everything you watched", icon: Brain },
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

const TOTAL_STEPS = 8;

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 mb-10">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div key={i} className="flex-1 h-[3px] rounded-full overflow-hidden bg-white/10">
          <motion.div
            className="h-full gradient-vermilion"
            initial={{ width: "0%" }}
            animate={{ width: i < step ? "100%" : "0%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [genres, setGenres] = useState<string[]>([]);
  const [pacing, setPacing] = useState("");
  const [protagonist, setProtagonist] = useState("");
  const [atmosphere, setAtmosphere] = useState("");
  const [payoff, setPayoff] = useState("");
  const [eras, setEras] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const toggleGenre = (val: string) =>
    setGenres((prev) => (prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]));

  const toggleEra = (val: string) =>
    setEras((prev) => (prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]));

  const canNext = () => {
    if (step === 1) return true;
    if (step === 2) return genres.length >= 1;
    if (step === 3) return !!pacing;
    if (step === 4) return !!protagonist;
    if (step === 5) return !!atmosphere;
    if (step === 6) return !!payoff;
    if (step === 7) return eras.length >= 1;
    if (step === 8) return !!experience;
    return true;
  };

  const finish = async () => {
    setSaving(true);
    await fetch("/api/user/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        preferences: { genres, pacing, protagonist, atmosphere, payoff, eras, experience },
        onboardingCompleted: true,
      }),
    }).catch(() => {});
    router.push("/recommendations");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24 bg-ink relative">
      <div className="w-full max-w-2xl">
        <ProgressBar step={step} />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            {/* Step 1 — Welcome */}
            {step === 1 && (
              <div className="text-center space-y-4 py-8">
                <p className="font-jp text-[11px] text-vermilion tracking-[0.4em] uppercase font-bold">
                  アニメの宇宙へようこそ
                </p>
                <h1 className="font-headline text-4xl md:text-5xl font-bold text-warm-white">
                  Craft Your Deep Anime Profile
                </h1>
                <p className="font-body text-warm-white/60 text-base max-w-lg mx-auto">
                  We calculate vector matches across 7 narrative dimensions. Tell us your storytelling preferences to unlock your personalized recommendation universe.
                </p>
              </div>
            )}

            {/* Step 2 — Genres */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <span className="font-label text-[10px] uppercase tracking-widest text-vermilion font-bold block mb-1">
                    01 / 07 — Genre Spectrum
                  </span>
                  <h2 className="font-headline text-3xl md:text-4xl font-bold text-warm-white">Which genres fuel your imagination?</h2>
                  <p className="text-warm-white/50 font-body text-sm mt-1">Select all that resonate with your taste.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {GENRES.map((g) => (
                    <button
                      key={g}
                      onClick={() => toggleGenre(g)}
                      className={cn(
                        "px-5 py-2.5 rounded-full font-label text-xs uppercase tracking-wider border transition-all duration-200 font-bold",
                        genres.includes(g)
                          ? "gradient-vermilion border-transparent text-white shadow-glow"
                          : "border-white/10 text-warm-white/60 hover:border-white/25 hover:text-warm-white bg-white/5"
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 — Pacing */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <span className="font-label text-[10px] uppercase tracking-widest text-vermilion font-bold block mb-1">
                    02 / 07 — Narrative Pacing
                  </span>
                  <h2 className="font-headline text-3xl md:text-4xl font-bold text-warm-white">What story pacing do you prefer?</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PACING_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const selected = pacing === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setPacing(opt.id)}
                        className={cn(
                          "p-5 rounded-2xl glass border text-left flex items-start gap-4 transition-all duration-300",
                          selected
                            ? "border-vermilion/60 bg-vermilion/10 shadow-glow"
                            : "border-white/10 hover:border-white/25 hover:bg-white/5"
                        )}
                      >
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", selected ? "gradient-vermilion text-white" : "bg-white/10 text-warm-white/60")}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-label text-xs font-bold uppercase tracking-wider text-warm-white">{opt.label}</h4>
                          <p className="font-body text-xs text-warm-white/50 mt-1">{opt.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4 — Protagonist */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <span className="font-label text-[10px] uppercase tracking-widest text-vermilion font-bold block mb-1">
                    03 / 07 — Protagonist Archetype
                  </span>
                  <h2 className="font-headline text-3xl md:text-4xl font-bold text-warm-white">What type of main character do you root for?</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PROTAGONIST_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const selected = protagonist === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setProtagonist(opt.id)}
                        className={cn(
                          "p-5 rounded-2xl glass border text-left flex items-start gap-4 transition-all duration-300",
                          selected
                            ? "border-vermilion/60 bg-vermilion/10 shadow-glow"
                            : "border-white/10 hover:border-white/25 hover:bg-white/5"
                        )}
                      >
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", selected ? "gradient-vermilion text-white" : "bg-white/10 text-warm-white/60")}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-label text-xs font-bold uppercase tracking-wider text-warm-white">{opt.label}</h4>
                          <p className="font-body text-xs text-warm-white/50 mt-1">{opt.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 5 — Atmosphere */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <span className="font-label text-[10px] uppercase tracking-widest text-vermilion font-bold block mb-1">
                    04 / 07 — Atmosphere & Setting
                  </span>
                  <h2 className="font-headline text-3xl md:text-4xl font-bold text-warm-white">Which world atmosphere calls to you?</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ATMOSPHERE_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const selected = atmosphere === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setAtmosphere(opt.id)}
                        className={cn(
                          "p-5 rounded-2xl glass border text-left flex items-start gap-4 transition-all duration-300",
                          selected
                            ? "border-vermilion/60 bg-vermilion/10 shadow-glow"
                            : "border-white/10 hover:border-white/25 hover:bg-white/5"
                        )}
                      >
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", selected ? "gradient-vermilion text-white" : "bg-white/10 text-warm-white/60")}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-label text-xs font-bold uppercase tracking-wider text-warm-white">{opt.label}</h4>
                          <p className="font-body text-xs text-warm-white/50 mt-1">{opt.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 6 — Finale Payoff */}
            {step === 6 && (
              <div className="space-y-6">
                <div>
                  <span className="font-label text-[10px] uppercase tracking-widest text-vermilion font-bold block mb-1">
                    05 / 07 — Emotional Payoff
                  </span>
                  <h2 className="font-headline text-3xl md:text-4xl font-bold text-warm-white">What payoff do you crave in a finale?</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PAYOFF_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const selected = payoff === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setPayoff(opt.id)}
                        className={cn(
                          "p-5 rounded-2xl glass border text-left flex items-start gap-4 transition-all duration-300",
                          selected
                            ? "border-vermilion/60 bg-vermilion/10 shadow-glow"
                            : "border-white/10 hover:border-white/25 hover:bg-white/5"
                        )}
                      >
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", selected ? "gradient-vermilion text-white" : "bg-white/10 text-warm-white/60")}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-label text-xs font-bold uppercase tracking-wider text-warm-white">{opt.label}</h4>
                          <p className="font-body text-xs text-warm-white/50 mt-1">{opt.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 7 — Eras */}
            {step === 7 && (
              <div className="space-y-6">
                <div>
                  <span className="font-label text-[10px] uppercase tracking-widest text-vermilion font-bold block mb-1">
                    06 / 07 — Aesthetic Era
                  </span>
                  <h2 className="font-headline text-3xl md:text-4xl font-bold text-warm-white">Which animation eras do you appreciate?</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ERAS.map((e) => (
                    <button
                      key={e.value}
                      onClick={() => toggleEra(e.value)}
                      className={cn(
                        "p-5 rounded-2xl glass border text-left transition-all font-bold",
                        eras.includes(e.value)
                          ? "border-vermilion/60 bg-vermilion/10 shadow-glow"
                          : "border-white/10 hover:border-white/25 hover:bg-white/5"
                      )}
                    >
                      <h4 className="font-label text-xs font-bold uppercase tracking-wider text-warm-white">{e.label}</h4>
                      <p className="font-body text-xs text-warm-white/50 mt-1">{e.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 8 — Experience Level */}
            {step === 8 && (
              <div className="space-y-6">
                <div>
                  <span className="font-label text-[10px] uppercase tracking-widest text-vermilion font-bold block mb-1">
                    07 / 07 — Experience Level
                  </span>
                  <h2 className="font-headline text-3xl md:text-4xl font-bold text-warm-white">Where are you on your anime path?</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {EXPERIENCE.map((exp) => (
                    <button
                      key={exp.value}
                      onClick={() => setExperience(exp.value)}
                      className={cn(
                        "p-5 rounded-2xl glass border text-left transition-all font-bold",
                        experience === exp.value
                          ? "border-vermilion/60 bg-vermilion/10 shadow-glow"
                          : "border-white/10 hover:border-white/25 hover:bg-white/5"
                      )}
                    >
                      <h4 className="font-label text-xs font-bold uppercase tracking-wider text-warm-white">{exp.label}</h4>
                      <p className="font-body text-xs text-warm-white/50 mt-1">{exp.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-10 border-t border-white/10 mt-10">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-6 py-3 rounded-xl glass border border-white/10 text-warm-white/60 hover:text-warm-white hover:border-white/20 font-label text-xs uppercase tracking-widest font-bold"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS ? (
            <button
              disabled={!canNext()}
              onClick={() => setStep((s) => s + 1)}
              className="px-8 py-3.5 rounded-xl gradient-vermilion text-white font-label text-xs uppercase tracking-widest shadow-glow flex items-center gap-2 font-bold disabled:opacity-40"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              disabled={!canNext() || saving}
              onClick={finish}
              className="px-8 py-3.5 rounded-xl gradient-vermilion text-white font-label text-xs uppercase tracking-widest shadow-glow flex items-center gap-2 font-bold disabled:opacity-40"
            >
              <Sparkles className="w-4 h-4" />
              <span>{saving ? "Synthesizing Taste DNA..." : "Complete & Generate Picks"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
