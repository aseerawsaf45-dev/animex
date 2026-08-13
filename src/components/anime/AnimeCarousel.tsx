"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AnimeCard } from "./AnimeCard";

export function AnimeCarousel({ title, animes }: { title: string; animes: any[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (!animes || animes.length === 0) return null;

  return (
    <section ref={ref} className="space-y-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      </motion.div>

      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar">
          {animes.map((anime, i) => (
            <div key={anime.id} className="snap-start shrink-0 w-[150px] sm:w-[180px] md:w-[200px]">
              {isInView && <AnimeCard anime={anime} index={i} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
