"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { SakuraParticles } from "@/components/motion/SakuraParticles";
import { EASE_EXPO, EASE_INK } from "@/lib/motion";

export function CinematicHero() {
  const [bursting, setBursting] = useState(false);

  // 15 — Magnetic CTA Cursor Tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const btnX = useSpring(useTransform(mouseX, [-100, 100], [-8, 8]), { stiffness: 350, damping: 20 });
  const btnY = useSpring(useTransform(mouseY, [-100, 100], [-8, 8]), { stiffness: 350, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - (rect.left + rect.width / 2));
    mouseY.set(e.clientY - (rect.top + rect.height / 2));
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  // 16 — Button Particle Burst Trigger
  function handleCtaClick() {
    setBursting(true);
    setTimeout(() => setBursting(false), 500);
  }

  return (
    <header className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden bg-ink">
      {/* 01 — Hero Video Background Fade & Scale Reveal */}
      <div className="absolute inset-0 z-0">
        <div className="absolute right-0 top-0 w-full lg:w-2/3 h-full">
          <motion.video
            autoPlay
            loop
            muted
            playsInline
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.55, scale: 1 }}
            transition={{ duration: 1.6, ease: EASE_EXPO, delay: 0.3 }}
            className="w-full h-full object-cover object-right mix-blend-luminosity"
          >
            <source src="/Premium_Landing_Page_Hero_Vide.mp4" type="video/mp4" />
          </motion.video>
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        </div>
      </div>

      {/* 02 — Initial Traveling Red Ink Stroke Line */}
      <motion.div
        className="absolute top-0 left-0 bottom-0 w-full bg-vermilion z-30 pointer-events-none origin-left"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 0.9, ease: EASE_INK, delay: 0.1 }}
      />

      {/* Large Japanese Background Watermark */}
      <div className="japanese-deco text-[160px] md:text-[240px] font-bold leading-none top-1/2 -translate-y-1/2 left-[-5%] -z-10 select-none pointer-events-none">
        発見
      </div>

      <div className="page-container relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="max-w-2xl">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.4 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-vermilion animate-ping" />
            <span className="font-label text-xs uppercase tracking-[0.25em] text-vermilion font-bold">
              AI Anime Universe · Redefined
            </span>
          </motion.div>

          {/* 01 & 29 — Editorial Line-by-Line Headline Reveal */}
          <h1 className="font-ninja text-6xl md:text-[92px] leading-[1.04] tracking-tight text-warm-white mb-6">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.5 }}
              className="block"
            >
              Discover Your
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.65 }}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-warm-white via-warm-white to-warm-white/70"
            >
              Next Story
            </motion.span>
          </h1>

          {/* Decorative Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, ease: EASE_INK, delay: 0.8 }}
            className="h-1 w-24 bg-vermilion mb-8 rounded-full origin-left"
          />

          {/* Subtitle Rise */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.9 }}
            className="text-lg md:text-2xl text-warm-white/70 font-body font-light leading-relaxed mb-10 max-w-lg"
          >
            AI-powered recommendations shaped around your unique taste and cinematic preferences.
          </motion.p>

          {/* 15 & 16 — CTAs with Magnetic Motion & Particle Burst */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_EXPO, delay: 1.1 }}
            className="flex flex-wrap gap-6 items-center"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div style={{ x: btnX, y: btnY }} className="relative">
              <Link
                href="/onboarding"
                onClick={handleCtaClick}
                className="relative z-10 bg-vermilion hover:bg-crimson text-warm-white px-9 py-4 rounded-xl font-label uppercase tracking-widest text-xs transition-colors duration-300 shadow-[0_8px_30px_rgba(211,47,47,0.4)] inline-flex items-center gap-2.5 font-bold group"
              >
                <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                <span>Find My Anime</span>
              </Link>

              {/* 16 — Particle Burst Overlay */}
              {bursting && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-vermilion"
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{
                        x: (Math.random() - 0.5) * 120,
                        y: (Math.random() - 0.5) * 120,
                        opacity: 0,
                        scale: 0.2,
                      }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            <Link
              href="/discover"
              className="glass border border-white/20 hover:border-warm-white text-warm-white px-8 py-4 rounded-xl font-label uppercase tracking-widest text-xs transition-all duration-300 hover:bg-white/10 inline-flex items-center gap-2 font-semibold"
            >
              <span>Explore 350+ Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
