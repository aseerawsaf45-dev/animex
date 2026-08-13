"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Play, Bookmark, Check } from "lucide-react";
import { MatchScoreRing } from "@/components/recommendations/MatchScoreRing";
import { WhyPickedModal } from "@/components/recommendations/WhyPickedModal";
import { EASE_EXPO } from "@/lib/motion";

interface AnimeCardProps {
  anime: any;
  index?: number;
  showMatch?: boolean;
  matchScore?: number;
  reason?: string;
  initialStatus?: "PLAN_TO_WATCH" | "COMPLETED" | null;
}

export function AnimeCard({
  anime,
  index = 0,
  showMatch = false,
  matchScore,
  reason,
  initialStatus = null,
}: AnimeCardProps) {
  if (!anime) return null;

  const [status, setStatus] = useState<"PLAN_TO_WATCH" | "COMPLETED" | null>(initialStatus);
  const [loadingTrack, setLoadingTrack] = useState(false);

  // 06 & 14 — Magnetic Cursor & 3D Poster Parallax
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), { stiffness: 280, damping: 22 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), { stiffness: 280, damping: 22 });

  // 14 — Slight Magnetic Shift
  const magX = useTransform(x, [-0.5, 0.5], [-6, 6]);
  const magY = useTransform(y, [-0.5, 0.5], [-6, 6]);

  const title = anime.title?.english || anime.title?.romaji || anime.titleEnglish || anime.titleRomaji || "Unknown";
  const cover = anime.coverImage?.large || anime.coverImage?.medium || anime.coverImage || anime.bannerImage;
  const genres: string[] = (anime.genres || []).map((g: any) =>
    typeof g === "string" ? g : g.genre?.name || g.name || ""
  ).filter(Boolean).slice(0, 2);
  const score = matchScore ?? anime.averageScore;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const [modalOpen, setModalOpen] = useState(false);

  const toggleTracking = async (targetStatus: "PLAN_TO_WATCH" | "COMPLETED", e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loadingTrack) return;

    setLoadingTrack(true);
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animeId: anime.id, status: targetStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setStatus(data.status);
      }
    } catch (err) {
      console.error("Failed to toggle tracking:", err);
    } finally {
      setLoadingTrack(false);
    }
  };

  return (
    <>
      <WhyPickedModal
        anime={anime}
        explanation={{ matchPercentage: score, contextualBadge: "High Match" }}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{
          duration: 0.55,
          delay: Math.min(index * 0.07, 0.7),
          ease: EASE_EXPO,
        }}
        style={{ rotateX, rotateY, x: magX, y: magY, transformStyle: "preserve-3d", perspective: 900 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative flex flex-col gap-2.5 cursor-pointer"
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        <Link href={`/anime/${anime.id}`} className="absolute inset-0 z-20" aria-label={`View ${title}`} />

        {/* 07 & 13 — Glass Poster Container with Vermilion Lacquer Glow */}
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[16px] bg-charcoal border border-white/10 group-hover:border-vermilion/60 shadow-card group-hover:shadow-[0_20px_60px_rgba(180,20,20,0.18)] transition-all duration-400 backdrop-blur-xl">
          {cover ? (
            <img
              src={cover}
              alt={title}
              className="w-full h-full object-cover poster-img transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-charcoal to-surface flex items-center justify-center">
              <span className="font-jp text-warm-white/10 text-4xl">X</span>
            </div>
          )}

          {/* Ambient Dark Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent opacity-40 group-hover:opacity-90 transition-opacity duration-300" />

          {/* Play Button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <motion.div
              initial={{ scale: 0.6 }}
              whileInView={{ scale: 1 }}
              className="w-12 h-12 rounded-full gradient-vermilion flex items-center justify-center shadow-glow"
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
            </motion.div>
          </div>

          {/* Top Left: Match Score Ring Badge */}
          {score && (
            <div className="absolute top-2.5 left-2.5 z-10">
              {showMatch ? (
                <MatchScoreRing score={score} size={42} strokeWidth={3.5} />
              ) : (
                <span className="glass border border-white/15 text-white text-[10px] font-bold font-label px-2.5 py-1 rounded-[6px] tabular-nums shadow-md">
                  {score}%
                </span>
              )}
            </div>
          )}

          {/* Top Right: Watchlist / Completed Action Icons */}
          <div className="absolute top-2.5 right-2.5 z-30 flex items-center gap-1.5">
            {/* Watchlist Toggle Button */}
            <button
              type="button"
              onClick={(e) => toggleTracking("PLAN_TO_WATCH", e)}
              title={status === "PLAN_TO_WATCH" ? "Remove from Watchlist" : "Add to Watchlist"}
              className={`w-8 h-8 rounded-full glass border flex items-center justify-center transition-all duration-300 shadow-md ${
                status === "PLAN_TO_WATCH"
                  ? "bg-vermilion/90 border-vermilion text-white shadow-glow"
                  : "border-white/20 text-warm-white/70 hover:text-white hover:border-white/40 hover:bg-white/10"
              }`}
            >
              <Bookmark className="w-4 h-4" fill={status === "PLAN_TO_WATCH" ? "currentColor" : "none"} />
            </button>

            {/* Completed Toggle Button */}
            <button
              type="button"
              onClick={(e) => toggleTracking("COMPLETED", e)}
              title={status === "COMPLETED" ? "Mark as Uncompleted" : "Mark as Completed"}
              className={`w-8 h-8 rounded-full glass border flex items-center justify-center transition-all duration-300 shadow-md ${
                status === "COMPLETED"
                  ? "bg-emerald-600/90 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  : "border-white/20 text-warm-white/70 hover:text-white hover:border-white/40 hover:bg-white/10"
              }`}
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1 px-0.5">
          <h3 className="font-headline text-[14px] font-semibold text-warm-white leading-tight line-clamp-1 group-hover:text-vermilion transition-colors duration-200">
            {title}
          </h3>
          {genres.length > 0 && (
            <p className="text-[11px] text-warm-white/40 font-body line-clamp-1">
              {genres.join(" · ")}
            </p>
          )}

          {/* 05 — Why this pick? trigger */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setModalOpen(true);
            }}
            className="z-30 text-[10px] font-label font-bold text-vermilion hover:underline inline-flex items-center gap-1 pt-0.5"
          >
            Why this pick? →
          </button>
        </div>
      </motion.div>
    </>
  );
}
