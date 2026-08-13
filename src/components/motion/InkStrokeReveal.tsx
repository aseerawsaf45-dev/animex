"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { EASE_INK, EASE_EXPO } from "@/lib/motion";

interface InkStrokeRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function InkStrokeReveal({ children, delay = 0, className = "" }: InkStrokeRevealProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Traveling Red Brush / Ink Stroke Line */}
      <motion.div
        className="absolute top-0 left-0 bottom-0 w-full bg-vermilion z-20 pointer-events-none origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: [0, 1, 0] }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 0.9,
          ease: EASE_INK,
          delay,
          times: [0, 0.45, 1],
        }}
        style={{
          boxShadow: "0 0 20px rgba(211,47,47,0.6)",
        }}
      />

      {/* Content Reveal with Clip-Path */}
      <motion.div
        initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
        whileInView={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 0.7,
          ease: EASE_EXPO,
          delay: delay + 0.35,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
