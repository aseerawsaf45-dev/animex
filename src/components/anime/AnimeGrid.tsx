"use client";

import { motion } from "framer-motion";
import { AnimeCard } from "./AnimeCard";

export function AnimeGrid({ animes }: { animes: any[] }) {
  if (!animes || animes.length === 0) {
    return <div className="text-muted-foreground text-center py-12">No anime found.</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {animes.map((anime, i) => (
        <AnimeCard key={anime.id} anime={anime} index={i} />
      ))}
    </div>
  );
}
