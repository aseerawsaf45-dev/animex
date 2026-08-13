"use client";

import { useEffect, useState } from "react";
import { Plus, Check, Bookmark, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WatchlistDetailButtonsProps {
  animeId: number;
  className?: string;
}

export function WatchlistDetailButtons({
  animeId,
  className = "",
}: WatchlistDetailButtonsProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/watchlist?animeId=${animeId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.success) {
          setStatus(data.status);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [animeId]);

  const toggleStatus = async (targetStatus: "PLAN_TO_WATCH" | "COMPLETED") => {
    if (updating) return;
    setUpdating(targetStatus);

    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animeId, status: targetStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setStatus(data.status);
      }
    } catch (err) {
      console.error("Failed to update watchlist:", err);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="h-12 w-44 rounded-full glass border border-white/10 flex items-center justify-center text-warm-white/40">
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          <span className="font-label text-xs uppercase tracking-wider">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {/* 1. Watch Later (Plan to Watch) Button */}
      <button
        type="button"
        onClick={() => toggleStatus("PLAN_TO_WATCH")}
        disabled={updating !== null}
        className={cn(
          "font-label font-bold uppercase tracking-wider text-xs px-6 py-3.5 rounded-full flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md",
          status === "PLAN_TO_WATCH"
            ? "gradient-vermilion text-white shadow-glow"
            : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
        )}
      >
        {updating === "PLAN_TO_WATCH" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : status === "PLAN_TO_WATCH" ? (
          <>
            <Clock className="w-4 h-4" />
            <span>In Watch Later</span>
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            <span>Watch Later</span>
          </>
        )}
      </button>

      {/* 2. Watched / Completed Button */}
      <button
        type="button"
        onClick={() => toggleStatus("COMPLETED")}
        disabled={updating !== null}
        className={cn(
          "font-label font-bold uppercase tracking-wider text-xs px-6 py-3.5 rounded-full flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md",
          status === "COMPLETED"
            ? "bg-emerald-600 border border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]"
            : "bg-transparent border border-white/20 hover:border-white/50 text-white hover:bg-white/5"
        )}
      >
        {updating === "COMPLETED" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : status === "COMPLETED" ? (
          <>
            <Check className="w-4 h-4 text-emerald-200" />
            <span>Completed</span>
          </>
        ) : (
          <>
            <Check className="w-4 h-4" />
            <span>Mark Watched</span>
          </>
        )}
      </button>

      {/* 3. Bookmark Quick Action Button */}
      <button
        type="button"
        onClick={() => toggleStatus("PLAN_TO_WATCH")}
        disabled={updating !== null}
        title={status === "PLAN_TO_WATCH" ? "Bookmarked" : "Bookmark Anime"}
        className={cn(
          "w-12 h-12 rounded-full glass border flex items-center justify-center transition-all duration-300 shadow-md",
          status === "PLAN_TO_WATCH"
            ? "bg-vermilion/90 border-vermilion text-white shadow-glow"
            : "border-white/20 text-warm-white/70 hover:text-white hover:border-white/40 hover:bg-white/10"
        )}
      >
        <Bookmark className="w-5 h-5" fill={status === "PLAN_TO_WATCH" ? "currentColor" : "none"} />
      </button>
    </div>
  );
}
