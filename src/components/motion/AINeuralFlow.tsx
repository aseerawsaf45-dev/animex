"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Sparkles, Cpu, Layers } from "lucide-react";
import { EASE_EXPO, EASE_INK } from "@/lib/motion";

const THINKING_STATES = [
  "UNDERSTANDING YOUR TASTE PROFILE",
  "MATCHING VECTOR EMBEDDINGS",
  "HYBRID RANKING & NOVELTY SCORING",
  "CURATING YOUR ANIME UNIVERSE",
];

export function AIThinkingAnimation({ className = "" }: { className?: string }) {
  const [stateIndex, setStateIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStateIndex((prev) => (prev + 1) % THINKING_STATES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center p-8 space-y-4 ${className}`}>
      <div className="flex items-center gap-2.5">
        <Sparkles className="w-4 h-4 text-vermilion animate-pulse" />
        <motion.span
          key={stateIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: EASE_EXPO }}
          className="font-label text-xs uppercase tracking-[0.25em] text-warm-white/80 font-bold"
        >
          {THINKING_STATES[stateIndex]}
        </motion.span>
      </div>

      {/* 10 — Animated Red Line with Traveling Dot */}
      <div className="relative w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-vermilion to-transparent shadow-[0_0_12px_#D32F2F]"
          animate={{ x: [-64, 256] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

export function AINeuralFlowVisualizer({ className = "" }: { className?: string }) {
  return (
    <div className={`relative p-8 rounded-[24px] glass border border-white/10 overflow-hidden ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-vermilion" />
          <span className="font-label text-[11px] uppercase tracking-widest text-warm-white/70">
            Neural Vector Engine (384-D)
          </span>
        </div>
        <span className="font-label text-[10px] text-vermilion uppercase tracking-widest px-2.5 py-1 rounded-full bg-vermilion/10 border border-vermilion/20">
          Live Hybrid Inference
        </span>
      </div>

      {/* SVG Neural Flow Graph */}
      <div className="relative h-48 w-full flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 500 180">
          {/* Connecting Beams */}
          <motion.path
            d="M 50 90 L 200 40 M 50 90 L 200 90 M 50 90 L 200 140"
            stroke="rgba(211,47,47,0.3)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            fill="none"
          />
          <motion.path
            d="M 200 40 L 350 65 M 200 90 L 350 65 M 200 90 L 350 115 M 200 140 L 350 115"
            stroke="rgba(211,47,47,0.4)"
            strokeWidth="1.5"
            fill="none"
          />
          <motion.path
            d="M 350 65 L 450 90 M 350 115 L 450 90"
            stroke="#D32F2F"
            strokeWidth="2"
            fill="none"
          />

          {/* User Taste Node */}
          <g transform="translate(50, 90)">
            <circle r="16" fill="rgba(211,47,47,0.2)" stroke="#D32F2F" strokeWidth="2" />
            <circle r="6" fill="#FAF8F3" />
            <text x="0" y="32" textAnchor="middle" fill="rgba(250,248,243,0.6)" fontSize="9" className="font-label uppercase">
              User Taste
            </text>
          </g>

          {/* Feature Layer Nodes */}
          {[
            { y: 40, label: "Genres" },
            { y: 90, label: "Themes" },
            { y: 140, label: "Jikan MAL" },
          ].map((n, i) => (
            <g key={i} transform={`translate(200, ${n.y})`}>
              <motion.circle
                r="10"
                fill="#111111"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1.5"
                animate={{ stroke: ["rgba(255,255,255,0.3)", "#D32F2F", "rgba(255,255,255,0.3)"] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
              />
              <circle r="4" fill="#D32F2F" />
              <text x="0" y="24" textAnchor="middle" fill="rgba(250,248,243,0.5)" fontSize="8" className="font-label uppercase">
                {n.label}
              </text>
            </g>
          ))}

          {/* Hybrid Ranking Nodes */}
          {[
            { y: 65, label: "pgvector" },
            { y: 115, label: "MMR Diversity" },
          ].map((n, i) => (
            <g key={i} transform={`translate(350, ${n.y})`}>
              <motion.circle
                r="12"
                fill="rgba(211,47,47,0.15)"
                stroke="#D32F2F"
                strokeWidth="1.5"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.5 }}
              />
              <circle r="5" fill="#FAF8F3" />
              <text x="0" y="26" textAnchor="middle" fill="rgba(250,248,243,0.6)" fontSize="8" className="font-label uppercase">
                {n.label}
              </text>
            </g>
          ))}

          {/* Final Output Node */}
          <g transform="translate(450, 90)">
            <motion.circle
              r="18"
              fill="rgba(211,47,47,0.3)"
              stroke="#D32F2F"
              strokeWidth="2.5"
              animate={{ boxShadow: "0 0 25px rgba(211,47,47,0.8)" }}
            />
            <circle r="8" fill="#FAF8F3" />
            <text x="0" y="34" textAnchor="middle" fill="#FAF8F3" fontSize="9" fontWeight="bold" className="font-label uppercase">
              Top Picks
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
