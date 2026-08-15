"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Dna, Activity, ArrowRight, ShieldAlert, Zap, Flame, Compass, Brain, Edit3, Target, Radio } from "lucide-react";
import { EASE_EXPO } from "@/lib/motion";
import Link from "next/link";
import { EditTasteDNAModal } from "./EditTasteDNAModal";
import { cn } from "@/lib/utils";

interface StatDimension {
  statKey: string;
  nameEn: string;
  nameJp: string;
  icon: any;
  value: number; // 0 - 100
  angle: number;
  grade: string;
  description: string;
}

export function TasteDNAChart({
  userPref,
  className = "",
  showEditButton = true,
}: {
  userPref?: any;
  className?: string;
  showEditButton?: boolean;
}) {
  const [pref, setPref] = useState<any>(userPref || null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (userPref) {
      setPref(userPref);
      return;
    }

    let isMounted = true;
    fetch("/api/user/preferences")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.data) {
          setPref(data.data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [userPref]);

  // Calculate precise 6-axis Anime Telemetry Stats (Combat Power, Mind Games, Worldcraft, Lore, Emotional Weight, Hype Factor)
  const calculateAnimeMatrix = (): StatDimension[] => {
    if (!pref || !pref.onboardingDone) {
      return [
        { statKey: "action", nameEn: "Sakuga / Combat", nameJp: "戦闘力", icon: Flame, value: 50, angle: -90, grade: "B", description: "Battle intensity & choreography" },
        { statKey: "psych", nameEn: "Mind Games / IQ", nameJp: "頭脳戦", icon: Brain, value: 50, angle: -30, grade: "B", description: "Psychological tension & stratagems" },
        { statKey: "world", nameEn: "Worldbuild / Sci-Fi", nameJp: "世界観", icon: Compass, value: 50, angle: 30, grade: "B", description: "Mythology, kingdoms & technology" },
        { statKey: "drama", nameEn: "Emotional Weight", nameJp: "感情値", icon: Activity, value: 50, angle: 90, grade: "B", description: "Character relationships & catharsis" },
        { statKey: "fantasy", nameEn: "Magic / Supernatural", nameJp: "異能力", icon: Zap, value: 50, angle: 150, grade: "B", description: "Power systems & mythical creatures" },
        { statKey: "hype", nameEn: "Hype / Climaxes", nameJp: "爆発力", icon: Target, value: 50, angle: 210, grade: "B", description: "Finale payoffs & adrenaline spikes" },
      ];
    }

    const rawAnswers = pref.moodPreferences || {};
    const genres: string[] = (pref.genreWeights as string[]) || rawAnswers.genres || [];
    const themes: string[] = (pref.themeWeights as string[]) || [];
    const pacing = rawAnswers.pacing || "";
    const protagonist = rawAnswers.protagonist || "";
    const atmosphere = rawAnswers.atmosphere || "";
    const payoff = rawAnswers.payoff || "";

    let combatScore = 40;
    let mindScore = 40;
    let worldScore = 40;
    let dramaScore = 40;
    let magicScore = 40;
    let hypeScore = 40;

    // 1. Genre Calibrations
    genres.forEach((g) => {
      const gl = g.toLowerCase();
      if (gl === "action" || gl === "sports") { combatScore += 25; hypeScore += 20; }
      if (gl === "psychological" || gl === "mystery" || gl === "thriller") { mindScore += 30; }
      if (gl === "sci-fi" || gl === "adventure") { worldScore += 25; }
      if (gl === "drama" || gl === "romance" || gl === "slice of life") { dramaScore += 30; }
      if (gl === "fantasy" || gl === "supernatural") { magicScore += 30; worldScore += 15; }
      if (gl === "horror") { mindScore += 15; dramaScore += 15; }
    });

    // 2. Narrative Dimension Tuning
    if (pacing === "fast") { combatScore += 15; hypeScore += 25; }
    if (pacing === "slow-burn") { mindScore += 25; worldScore += 15; }
    if (pacing === "character-drama") { dramaScore += 25; }
    if (pacing === "episodic") { worldScore += 20; }

    if (protagonist === "strategist") { mindScore += 30; }
    if (protagonist === "underdog") { combatScore += 20; hypeScore += 20; }
    if (protagonist === "anti-hero") { mindScore += 20; combatScore += 15; }
    if (protagonist === "relatable") { dramaScore += 20; }

    if (atmosphere === "cyberpunk") { worldScore += 25; mindScore += 15; }
    if (atmosphere === "fantasy") { magicScore += 30; worldScore += 20; }
    if (atmosphere === "military") { combatScore += 20; mindScore += 20; }
    if (atmosphere === "cozy") { dramaScore += 20; }

    if (payoff === "twists") { mindScore += 25; hypeScore += 15; }
    if (payoff === "tears") { dramaScore += 30; }
    if (payoff === "hype") { hypeScore += 30; combatScore += 20; }
    if (payoff === "peace") { dramaScore += 15; }

    const clamp = (v: number) => Math.min(99, Math.max(35, v));
    const toGrade = (val: number) => {
      if (val >= 90) return "S+";
      if (val >= 80) return "S";
      if (val >= 70) return "A";
      if (val >= 55) return "B";
      return "C";
    };

    const finalCombat = clamp(combatScore);
    const finalMind = clamp(mindScore);
    const finalWorld = clamp(worldScore);
    const finalDrama = clamp(dramaScore);
    const finalMagic = clamp(magicScore);
    const finalHype = clamp(hypeScore);

    return [
      { statKey: "action", nameEn: "Sakuga / Combat", nameJp: "戦闘力", icon: Flame, value: finalCombat, angle: -90, grade: toGrade(finalCombat), description: "High-octane choreography & battle energy" },
      { statKey: "psych", nameEn: "Mind Games / IQ", nameJp: "頭脳戦", icon: Brain, value: finalMind, angle: -30, grade: toGrade(finalMind), description: "Psychological tension, twists & 4D chess" },
      { statKey: "world", nameEn: "Worldbuild / Sci-Fi", nameJp: "世界観", icon: Compass, value: finalWorld, angle: 30, grade: toGrade(finalWorld), description: "Immersive lore, technology & factions" },
      { statKey: "drama", nameEn: "Emotional Weight", nameJp: "感情値", icon: Activity, value: finalDrama, angle: 90, grade: toGrade(finalDrama), description: "Character relationships, tears & depth" },
      { statKey: "fantasy", nameEn: "Magic / Supernatural", nameJp: "異能力", icon: Zap, value: finalMagic, angle: 150, grade: toGrade(finalMagic), description: "Power systems, grimoires & supernatural rules" },
      { statKey: "hype", nameEn: "Hype / Climaxes", nameJp: "爆発力", icon: Target, value: finalHype, angle: 210, grade: toGrade(finalHype), description: "Adrenaline payoff, sakuga peaks & triumph" },
    ];
  };

  const dimensions = calculateAnimeMatrix();
  const hasProfile = pref && pref.onboardingDone;

  // Determine Class / Archetype title
  const sorted = [...dimensions].sort((a, b) => b.value - a.value);
  const getArchetype = () => {
    if (!hasProfile) return "Cadet Observer (Uncalibrated)";
    const topKey = sorted[0].statKey;
    const secondKey = sorted[1].statKey;
    if (topKey === "action" && secondKey === "hype") return "Battle Shonen Vanguard";
    if (topKey === "psych" || secondKey === "psych") return "Tactical Seinen Mastermind";
    if (topKey === "world" && secondKey === "fantasy") return "Grand Fantasy Chronicler";
    if (topKey === "drama") return "High-Emotion Narrative Connoisseur";
    if (topKey === "fantasy") return "Supernatural Lore Adept";
    return "Omni-Spectrum Anime Enthusiast";
  };

  const archetypeTitle = getArchetype();

  const size = 300;
  const center = size / 2;
  const maxRadius = 90;

  const getCoordinates = (value: number, angleDeg: number) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const r = (value / 100) * maxRadius;
    const x = center + r * Math.cos(angleRad);
    const y = center + r * Math.sin(angleRad);
    return { x, y };
  };

  const polygonPoints = dimensions
    .map((d) => {
      const { x, y } = getCoordinates(d.value, d.angle);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <>
      <div className={cn("relative rounded-[28px] sm:rounded-[32px] p-5 sm:p-8 md:p-9 glass-card border border-white/12 shadow-2xl overflow-hidden bg-ink/95 group", className)}>
        {/* Cyberpunk HUD Grid Accents */}
        <div className="flex items-center justify-between font-mono text-[9px] text-warm-white/40 uppercase tracking-widest select-none pointer-events-none mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-vermilion animate-pulse" />
            <span>VECTOR_TELEMETRY // ANMX-DNA</span>
          </div>
          <div className="hidden xs:block text-warm-white/30">
            STATUS: {hasProfile ? "SYNC_LOCKED" : "CALIBRATING"}
          </div>
        </div>

        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl gradient-vermilion flex items-center justify-center text-white shadow-glow shrink-0 border border-white/20">
              <Dna className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-jp text-[10px] text-vermilion tracking-[0.25em] font-bold">
                  解析完了
                </span>
                <span className="text-white/20 text-xs hidden sm:inline">•</span>
                <span className="font-mono text-[10px] text-warm-white/40 uppercase tracking-wider">
                  Taste Vector Matrix
                </span>
              </div>
              <h3 className="font-headline text-xl sm:text-2xl md:text-3xl font-bold text-warm-white tracking-tight truncate">
                {archetypeTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {showEditButton && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl gradient-vermilion text-white hover:opacity-90 font-label text-xs uppercase tracking-wider font-bold shadow-glow flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Re-Tune DNA</span>
              </button>
            )}
          </div>
        </div>

        {/* Radar Matrix & Cyber HUD Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center pt-6">
          {/* Hexagonal Radar Chart SVG */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-center justify-center relative py-2">
            {/* Ambient Red Core Glow */}
            <div className="absolute w-40 h-40 bg-vermilion/20 rounded-full blur-2xl pointer-events-none" />

            <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-square flex items-center justify-center">
              <svg
                viewBox={`0 0 ${size} ${size}`}
                className="w-full h-full overflow-visible select-none"
              >
                <defs>
                  <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#D32F2F" stopOpacity="0.45" />
                    <stop offset="80%" stopColor="#D32F2F" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#D32F2F" stopOpacity="0.02" />
                  </radialGradient>
                </defs>

                {/* Concentric Hexagon Grid Rings */}
                {[0.25, 0.5, 0.75, 1.0].map((scale, i) => (
                  <polygon
                    key={i}
                    points={dimensions
                      .map((d) => {
                        const { x, y } = getCoordinates(100 * scale, d.angle);
                        return `${x},${y}`;
                      })
                      .join(" ")}
                    fill="none"
                    stroke={i === 3 ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)"}
                    strokeWidth={i === 3 ? "1.5" : "1"}
                    strokeDasharray={i === 3 ? "0" : "4 4"}
                  />
                ))}

                {/* Axis Rays */}
                {dimensions.map((d, i) => {
                  const { x, y } = getCoordinates(100, d.angle);
                  return (
                    <line
                      key={i}
                      x1={center}
                      y1={center}
                      x2={x}
                      y2={y}
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Center Tech Origin Dot */}
                <circle cx={center} cy={center} r="3" fill="#D32F2F" />

                {/* Dynamic Radar Area */}
                <motion.polygon
                  points={polygonPoints}
                  fill="url(#radarGlow)"
                  stroke="#D32F2F"
                  strokeWidth="2.5"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.0, ease: EASE_EXPO }}
                  style={{
                    transformOrigin: `${center}px ${center}px`,
                    filter: "drop-shadow(0 0 14px rgba(211,47,47,0.7))",
                  }}
                />

                {/* Stat Nodes & Interactive Label Rings */}
                {dimensions.map((d, i) => {
                  const point = getCoordinates(d.value, d.angle);
                  const labelPoint = getCoordinates(120, d.angle);
                  const isHovered = hoveredIndex === i;

                  return (
                    <g
                      key={i}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Node Dot */}
                      <motion.circle
                        cx={point.x}
                        cy={point.y}
                        r={isHovered ? "6.5" : "4"}
                        fill="#FAF8F3"
                        stroke="#D32F2F"
                        strokeWidth="2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                        style={{ filter: "drop-shadow(0 0 6px #D32F2F)" }}
                      />

                      {/* Stat Badge Label */}
                      <text
                        x={labelPoint.x}
                        y={labelPoint.y - 5}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#FAF8F3"
                        fontSize="9.5"
                        fontWeight="bold"
                        className="font-label uppercase tracking-wider"
                      >
                        {d.nameEn.split(" / ")[0]}
                      </text>
                      <text
                        x={labelPoint.x}
                        y={labelPoint.y + 6}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#D32F2F"
                        fontSize="8.5"
                        fontWeight="bold"
                        className="font-mono"
                      >
                        [{d.grade}] {d.value}%
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Stat Telemetry Breakdown (Anime Style Power Grid) */}
          <div className="lg:col-span-6 xl:col-span-5 space-y-2.5">
            <div className="flex items-center justify-between font-mono text-[9.5px] text-warm-white/40 border-b border-white/10 pb-1.5 uppercase tracking-wider">
              <span>STAT PARAMETER</span>
              <span>POWER RATING</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {dimensions.map((stat, i) => {
                const Icon = stat.icon;
                const isHovered = hoveredIndex === i;

                return (
                  <div
                    key={stat.statKey}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={cn(
                      "p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3",
                      isHovered
                        ? "border-vermilion bg-vermilion/15 shadow-glow"
                        : "border-white/5 bg-white/[0.02] hover:border-white/15"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", isHovered ? "gradient-vermilion text-white" : "bg-white/10 text-warm-white/60")}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <p className="font-label text-xs font-bold text-warm-white flex items-center gap-1.5 truncate">
                          <span className="truncate">{stat.nameEn}</span>
                          <span className="font-jp text-[10px] text-warm-white/30 font-normal shrink-0">{stat.nameJp}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-vermilion/20 border border-vermilion/40 text-vermilion font-bold">
                        {stat.grade}
                      </span>
                      <span className="font-mono text-xs font-bold text-warm-white min-w-[32px] text-right">
                        {stat.value}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Narrative Vector Insight */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 flex-1">
            <Radio className="w-4 h-4 text-vermilion shrink-0 mt-0.5 animate-pulse" />
            <p className="font-body text-xs text-warm-white/70 leading-relaxed">
              <span className="text-vermilion font-bold uppercase tracking-wider text-[10px] mr-1">Anime Vector Synthesis:</span>
              Dominant stats in <strong className="text-warm-white">{sorted[0].nameEn} ({sorted[0].value}%)</strong> and <strong className="text-warm-white">{sorted[1].nameEn} ({sorted[1].value}%)</strong>. Recommendations prioritize high-synergy titles in this archetype.
            </p>
          </div>

          <Link
            href="/recommendations"
            className="text-xs font-label uppercase tracking-widest text-warm-white/60 hover:text-vermilion flex items-center gap-1.5 transition-colors shrink-0 font-bold"
          >
            <span>Recalibrate Pool</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Interactive Edit Taste DNA Modal */}
      <EditTasteDNAModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialPreferences={pref}
        onSaved={(newPref) => setPref(newPref)}
      />
    </>
  );
}

