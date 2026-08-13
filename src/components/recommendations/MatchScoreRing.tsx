"use client";

import { motion } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";

interface MatchScoreRingProps {
  score: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function MatchScoreRing({ score, size = 64, strokeWidth = 5, className = "" }: MatchScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Animated Progress Ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#D32F2F"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE_EXPO }}
          strokeLinecap="round"
          style={{
            filter: "drop-shadow(0 0 6px rgba(211,47,47,0.6))",
          }}
        />
      </svg>
      {/* Score Label Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-label font-bold text-xs text-warm-white leading-none">
          {score}%
        </span>
        <span className="font-label text-[8px] text-warm-white/40 uppercase tracking-tighter">
          Match
        </span>
      </div>
    </div>
  );
}

interface RecommendationDNABarsProps {
  genreScore?: number;
  themeScore?: number;
  storyScore?: number;
  communityScore?: number;
  className?: string;
}

export function RecommendationDNABars({
  genreScore = 96,
  themeScore = 91,
  storyScore = 95,
  communityScore = 84,
  className = "",
}: RecommendationDNABarsProps) {
  const metrics = [
    { label: "Genre Affinity", value: genreScore },
    { label: "Theme Alignment", value: themeScore },
    { label: "Story Vector", value: storyScore },
    { label: "Community Consensus", value: communityScore },
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      {metrics.map((m, i) => (
        <div key={m.label} className="space-y-1">
          <div className="flex justify-between items-center font-label text-[11px] uppercase tracking-wider">
            <span className="text-warm-white/60">{m.label}</span>
            <span className="text-vermilion font-bold">{m.value}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-vermilion"
              initial={{ width: 0 }}
              whileInView={{ width: `${m.value}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE_EXPO, delay: i * 0.1 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
