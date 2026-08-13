"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { EASE_EXPO } from "@/lib/motion";

export function ToriiTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} className="relative">
        {/* Abstract Torii Gate Frame Overlay during route transition */}
        <motion.div
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Top Horizontal Beam */}
          <motion.div
            className="absolute top-8 left-6 right-6 h-[3px] bg-vermilion shadow-[0_0_15px_rgba(211,47,47,0.8)]"
            variants={{
              initial: { scaleX: 0, opacity: 0 },
              animate: { scaleX: [0, 1, 0], opacity: [0, 1, 0] },
            }}
            transition={{ duration: 0.6, ease: EASE_EXPO }}
          />

          {/* Left Vertical Pillar */}
          <motion.div
            className="absolute left-8 top-6 bottom-6 w-[3px] bg-vermilion shadow-[0_0_15px_rgba(211,47,47,0.8)] origin-top"
            variants={{
              initial: { scaleY: 0, opacity: 0 },
              animate: { scaleY: [0, 1, 0], opacity: [0, 1, 0] },
            }}
            transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.05 }}
          />

          {/* Right Vertical Pillar */}
          <motion.div
            className="absolute right-8 top-6 bottom-6 w-[3px] bg-vermilion shadow-[0_0_15px_rgba(211,47,47,0.8)] origin-top"
            variants={{
              initial: { scaleY: 0, opacity: 0 },
              animate: { scaleY: [0, 1, 0], opacity: [0, 1, 0] },
            }}
            transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.05 }}
          />
        </motion.div>

        {/* Page Content Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -10 }}
          transition={{ duration: 0.45, ease: EASE_EXPO }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
