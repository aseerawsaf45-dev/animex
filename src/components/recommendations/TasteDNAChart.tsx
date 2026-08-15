"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Dna, Activity, ArrowRight } from "lucide-react";
import { EASE_EXPO } from "@/lib/motion";
import Link from "next/link";

interface Dimension {
  label: string;
  value: number; // 0 to 100
  angle: number;
}

import { EditTasteDNAModal } from "./EditTasteDNAModal";
import { SlidersHorizontal, Edit3 } from "lucide-react";

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
  const [loading, setLoading] = useState(!userPref);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (userPref) {
      setPref(userPref);
      setLoading(false);
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
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userPref]);

  // Calculate real-time Taste DNA percentages based directly on User Onboarding Answers
  const calculateDNA = (): Dimension[] => {
    if (!pref || !pref.onboardingDone) {
      return [
        { label: "Psychological", value: 50, angle: -90 },
        { label: "Action", value: 50, angle: -18 },
        { label: "Romance", value: 50, angle: 54 },
        { label: "Fantasy", value: 50, angle: 126 },
        { label: "Drama", value: 50, angle: 198 },
      ];
    }

    const genres: string[] = (pref.genreWeights as string[]) || [];
    const themes: string[] = (pref.themeWeights as string[]) || [];

    let psychScore = 40;
    let actionScore = 40;
    let romanceScore = 40;
    let fantasyScore = 40;
    let dramaScore = 40;

    // Genre Weighting
    if (genres.includes("Psychological") || genres.includes("Mystery") || genres.includes("Thriller")) psychScore += 35;
    if (genres.includes("Action") || genres.includes("Sports") || genres.includes("Adventure")) actionScore += 35;
    if (genres.includes("Romance") || genres.includes("Slice of Life") || genres.includes("Comedy")) romanceScore += 35;
    if (genres.includes("Fantasy") || genres.includes("Sci-Fi") || genres.includes("Supernatural")) fantasyScore += 35;
    if (genres.includes("Drama") || genres.includes("Horror")) dramaScore += 35;

    // Theme & Questionnaire Weighting (pacing, protagonist, atmosphere, payoff)
    themes.forEach((t) => {
      if (t === "slow-burn" || t === "pacing:slow-burn" || t === "strategist" || t === "protagonist:strategist" || t === "twists" || t === "payoff:twists") psychScore += 20;
      if (t === "fast" || t === "pacing:fast" || t === "underdog" || t === "protagonist:underdog" || t === "anti-hero" || t === "protagonist:anti-hero" || t === "hype" || t === "payoff:hype") actionScore += 20;
      if (t === "cozy" || t === "atmosphere:cozy" || t === "relatable" || t === "protagonist:relatable" || t === "peace" || t === "payoff:peace") romanceScore += 20;
      if (t === "cyberpunk" || t === "atmosphere:cyberpunk" || t === "fantasy" || t === "atmosphere:fantasy" || t === "episodic" || t === "pacing:episodic") fantasyScore += 20;
      if (t === "character-drama" || t === "pacing:character-drama" || t === "military" || t === "atmosphere:military" || t === "tears" || t === "payoff:tears") dramaScore += 20;
    });

    return [
      { label: "Psychological", value: Math.min(98, Math.max(30, psychScore)), angle: -90 },
      { label: "Action", value: Math.min(98, Math.max(30, actionScore)), angle: -18 },
      { label: "Romance", value: Math.min(98, Math.max(30, romanceScore)), angle: 54 },
      { label: "Fantasy", value: Math.min(98, Math.max(30, fantasyScore)), angle: 126 },
      { label: "Drama", value: Math.min(98, Math.max(30, dramaScore)), angle: 198 },
    ];
  };

  const dimensions = calculateDNA();
  const hasProfile = pref && pref.onboardingDone;

  // Determine top preferences for dynamic taste narrative
  const sortedDims = [...dimensions].sort((a, b) => b.value - a.value);
  const topText = hasProfile
    ? `${sortedDims[0].label} (${sortedDims[0].value}%) and ${sortedDims[1].label} (${sortedDims[1].value}%)`
    : "Not configured yet";

  const size = 320;
  const center = size / 2;
  const maxRadius = 110;

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
      <div className={`glass rounded-[28px] p-8 border border-white/10 relative overflow-hidden shadow-2xl ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-vermilion flex items-center justify-center shadow-glow">
              <Dna className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-label text-[10px] text-vermilion uppercase tracking-[0.25em] font-bold block">
                Calculated Taste Vector
              </span>
              <h3 className="font-headline text-2xl font-bold text-warm-white">Your Anime Taste DNA</h3>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {showEditButton && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl glass border border-vermilion/40 bg-vermilion/10 text-warm-white hover:bg-vermilion/20 hover:border-vermilion transition-all font-label text-[11px] uppercase tracking-wider font-bold shadow-glow flex items-center gap-1.5 group"
              >
                <Edit3 className="w-3.5 h-3.5 text-vermilion group-hover:rotate-12 transition-transform" />
                <span>Edit Taste DNA</span>
              </button>
            )}

            <div className="hidden sm:flex px-3 py-1 rounded-full glass border border-white/10 text-[10px] font-label uppercase tracking-widest text-warm-white/60 items-center gap-1.5">
              <Activity className="w-3 h-3 text-vermilion animate-pulse" />
              {hasProfile ? "Active Calibration" : "Awaiting Profile"}
            </div>
          </div>
        </div>

        {/* Radar Chart SVG */}
        <div className="relative flex items-center justify-center my-4">
          <svg width={size} height={size} className="overflow-visible">
            {/* Background Concentric Grid Circles */}
            {[0.3, 0.65, 1.0].map((scale, i) => (
              <polygon
                key={i}
                points={dimensions
                  .map((d) => {
                    const { x, y } = getCoordinates(100 * scale, d.angle);
                    return `${x},${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
                strokeDasharray={i === 2 ? "0" : "3 3"}
              />
            ))}

            {/* Radial Axis Lines */}
            {dimensions.map((d, i) => {
              const { x, y } = getCoordinates(100, d.angle);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Animated Taste Polygon Shape */}
            <motion.polygon
              points={polygonPoints}
              fill={hasProfile ? "rgba(211,47,47,0.28)" : "rgba(255,255,255,0.05)"}
              stroke={hasProfile ? "#D32F2F" : "rgba(255,255,255,0.3)"}
              strokeWidth="2.5"
              strokeDasharray={hasProfile ? "0" : "4 4"}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE_EXPO }}
              style={{
                transformOrigin: `${center}px ${center}px`,
                filter: hasProfile ? "drop-shadow(0 0 16px rgba(211,47,47,0.5))" : "none",
              }}
            />

            {/* Dimension Nodes & Labels */}
            {dimensions.map((d, i) => {
              const point = getCoordinates(d.value, d.angle);
              const labelPoint = getCoordinates(122, d.angle);

              return (
                <g key={i}>
                  <motion.circle
                    cx={point.x}
                    cy={point.y}
                    r="5"
                    fill="#FAF8F3"
                    stroke={hasProfile ? "#D32F2F" : "#ffffff"}
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                  />

                  <text
                    x={labelPoint.x}
                    y={labelPoint.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#FAF8F3"
                    fontSize="11"
                    className="font-label font-semibold select-none"
                  >
                    {d.label} <tspan fill={hasProfile ? "#D32F2F" : "#ffffff"} fontWeight="bold">{d.value}%</tspan>
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Dynamic Taste Evolution Narrative or Onboarding CTA */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
          {hasProfile ? (
            <div className="flex items-start gap-3 flex-1">
              <Sparkles className="w-4 h-4 text-vermilion shrink-0 mt-0.5" />
              <p className="font-body text-xs text-warm-white/70 leading-relaxed">
                <span className="text-vermilion font-bold">Taste Insight:</span> Your top preferences calculated from your questionnaire are <span className="text-warm-white font-semibold">{topText}</span>.
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
              <p className="font-body text-xs text-warm-white/60">
                Complete your questionnaire to calculate your exact 5-axis Taste DNA.
              </p>
              <Link
                href="/onboarding"
                className="px-4 py-2 rounded-xl gradient-vermilion text-white font-label text-[10px] uppercase tracking-widest font-bold shadow-glow inline-flex items-center gap-1.5 shrink-0"
              >
                <span>Build Taste DNA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
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
