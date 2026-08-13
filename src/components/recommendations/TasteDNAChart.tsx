"use client";

import { motion } from "framer-motion";
import { Sparkles, Dna, Activity } from "lucide-react";
import { EASE_EXPO } from "@/lib/motion";

interface Dimension {
  label: string;
  value: number; // 0 to 100
  angle: number;
}

export function TasteDNAChart({ className = "" }: { className?: string }) {
  const dimensions: Dimension[] = [
    { label: "Psychological", value: 92, angle: -90 },
    { label: "Action", value: 94, angle: -18 },
    { label: "Romance", value: 42, angle: 54 },
    { label: "Fantasy", value: 81, angle: 126 },
    { label: "Drama", value: 86, angle: 198 },
  ];

  const size = 320;
  const center = size / 2;
  const maxRadius = 110;

  // Convert angle + percentage value to SVG (X, Y) coordinates
  const getCoordinates = (value: number, angleDeg: number) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const r = (value / 100) * maxRadius;
    const x = center + r * Math.cos(angleRad);
    const y = center + r * Math.sin(angleRad);
    return { x, y };
  };

  // Build SVG polygon points path string
  const polygonPoints = dimensions
    .map((d) => {
      const { x, y } = getCoordinates(d.value, d.angle);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className={`glass rounded-[28px] p-8 border border-white/10 relative overflow-hidden shadow-2xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-vermilion flex items-center justify-center shadow-glow">
            <Dna className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-label text-[10px] text-vermilion uppercase tracking-[0.25em] font-bold block">
              ML Personality Profile
            </span>
            <h3 className="font-headline text-2xl font-bold text-warm-white">Your Anime Taste DNA</h3>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full glass border border-white/10 text-[10px] font-label uppercase tracking-widest text-warm-white/60 flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-vermilion animate-pulse" /> Evolving Live
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
            fill="rgba(211,47,47,0.25)"
            stroke="#D32F2F"
            strokeWidth="2.5"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE_EXPO }}
            style={{
              transformOrigin: `${center}px ${center}px`,
              filter: "drop-shadow(0 0 16px rgba(211,47,47,0.5))",
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
                  stroke="#D32F2F"
                  strokeWidth="2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
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
                  {d.label} <tspan fill="#D32F2F" fontWeight="bold">{d.value}%</tspan>
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Dynamic Taste Evolution Narrative */}
      <div className="mt-4 pt-4 border-t border-white/10 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-vermilion shrink-0 mt-0.5" />
        <p className="font-body text-xs text-warm-white/70 leading-relaxed">
          <span className="text-vermilion font-bold">Taste Insight:</span> Dark psychological and action stories are currently your strongest preferences (+24% shift this month).
        </p>
      </div>
    </div>
  );
}
