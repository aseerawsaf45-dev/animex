"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/",               label: "Home" },
  { href: "/discover",       label: "Discover" },
  { href: "/recommendations",label: "Recommendations" },
  { href: "/seasonal",       label: "Seasonal"  },
  { href: "/watchlist",      label: "Watchlist" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-[60] hidden md:flex",
        "w-[calc(100%-48px)] max-w-6xl",
        "items-center justify-between px-6 py-3",
        "rounded-[22px] transition-all duration-300",
        scrolled
          ? "glass shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.07)] py-2.5"
          : "bg-transparent border border-white/0"
      )}
    >
      {/* 34 — Logo Animation */}
      <Link href="/" className="flex items-center gap-2.5 group shrink-0">
        <motion.div
          whileHover={{ rotate: 8, scale: 1.08 }}
          transition={{ type: "spring", stiffness: 350, damping: 15 }}
          className="relative"
        >
          <img src="/logo.png" alt="AnimeX Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(211,47,47,0.7)] group-hover:drop-shadow-[0_0_18px_rgba(211,47,47,0.95)] transition-all duration-300" />
        </motion.div>
        <span className="font-headline text-[17px] font-bold text-warm-white tracking-tight group-hover:text-vermilion transition-colors duration-300">
          AnimeX
        </span>
      </Link>

      {/* 30 — Red Line Navigation Indicator */}
      <nav className="flex items-center gap-2">
        {navLinks.map((link) => {
          const isActive = link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative font-label text-[11px] uppercase tracking-[0.14em] px-4 py-2 rounded-[10px]",
                "transition-colors duration-200 flex items-center gap-1.5",
                isActive
                  ? "text-warm-white font-bold"
                  : "text-warm-white/55 hover:text-warm-white"
              )}
            >
              {/* Active Glowing Vermilion Dot */}
              {isActive && (
                <motion.span
                  layoutId="nav-active-dot"
                  className="w-1.5 h-1.5 rounded-full bg-vermilion shadow-[0_0_8px_#D32F2F]"
                />
              )}

              <span>{link.label}</span>

              {/* 30 — Red Underline Indicator */}
              {isActive ? (
                <motion.div
                  layoutId="nav-active-line"
                  className="absolute bottom-0 left-3 right-3 h-[2px] bg-vermilion shadow-[0_0_10px_rgba(211,47,47,0.9)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              ) : (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-vermilion/50 group-hover:w-3/4 transition-all duration-300" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/discover"
          className="flex items-center gap-2 px-3 py-2 rounded-[10px] text-warm-white/45 hover:text-warm-white hover:bg-white/5 transition-all duration-200"
        >
          <Search className="w-4 h-4" />
          <span className="font-label text-[11px] uppercase tracking-[0.12em]">Search</span>
        </Link>

        <Link
          href="/profile"
          className="w-8 h-8 rounded-full border border-vermilion/40 hover:border-vermilion overflow-hidden flex items-center justify-center bg-surface transition-all duration-200 hover:shadow-glow"
        >
          <User className="w-4 h-4 text-warm-white/60" />
        </Link>
      </div>
    </motion.header>
  );
}
