"use client";

import { motion } from "framer-motion";

export function RadarChart({ 
  data 
}: { 
  data: { label: string; value: number }[] 
}) {
  const size = 300;
  const center = size / 2;
  const radius = (size / 2) - 40;
  const numPoints = data.length;
  const angleStep = (Math.PI * 2) / numPoints;

  // Generate points for the background web
  const levels = 4;
  const webPaths = [];
  for (let level = 1; level <= levels; level++) {
    const levelRadius = radius * (level / levels);
    const points = [];
    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = center + levelRadius * Math.cos(angle);
      const y = center + levelRadius * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    webPaths.push(points.join(" "));
  }

  // Generate points for the data polygon
  const dataPoints = data.map((d, i) => {
    const angle = i * angleStep - Math.PI / 2;
    // value is 0-1
    const r = radius * d.value;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  });

  // Labels
  const labels = data.map((d, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const labelRadius = radius + 25;
    const x = center + labelRadius * Math.cos(angle);
    const y = center + labelRadius * Math.sin(angle);
    return { text: d.label, x, y };
  });

  return (
    <div className="relative w-full max-w-[300px] aspect-square mx-auto">
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
        {/* Background Web */}
        {webPaths.map((path, i) => (
          <polygon
            key={i}
            points={path}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-white/10"
          />
        ))}
        {/* Axes */}
        {data.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeWidth="1"
              className="text-white/20"
            />
          );
        })}
        {/* Data Polygon */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: "spring" }}
          points={dataPoints.join(" ")}
          fill="rgba(211, 47, 47, 0.4)" /* vermilion */
          stroke="#D32F2F"
          strokeWidth="2"
          className="origin-center"
        />
        {/* Labels */}
        {labels.map((label, i) => (
          <text
            key={i}
            x={label.x}
            y={label.y}
            fill="currentColor"
            fontSize="12"
            textAnchor="middle"
            alignmentBaseline="middle"
            className="text-muted-foreground font-medium"
          >
            {label.text}
          </text>
        ))}
      </svg>
    </div>
  );
}
