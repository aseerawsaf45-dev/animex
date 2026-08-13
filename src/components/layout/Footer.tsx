"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const footerLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "About", href: "/about" },
  { label: "API", href: "/api-docs" },
];

export function Footer() {
  return (
    <footer className="relative hidden md:block py-14 px-8 border-t border-white/[0.05] overflow-hidden bg-ink">
      {/* Gradient fade top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Decorative Interactive Japanese Text (Hover to turn red with vermilion glow) */}
      <motion.div
        initial={{ opacity: 0.1, color: "#FAF8F3" }}
        whileHover={{
          opacity: 1,
          color: "#D32F2F",
          scale: 1.04,
          filter: "drop-shadow(0 0 35px rgba(211,47,47,0.95))",
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-12 top-8 font-jp text-6xl md:text-7xl font-extrabold select-none cursor-pointer tracking-wider z-0"
        aria-hidden
      >
        物語を発見する
      </motion.div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8 relative z-10">
        <div>
          {/* Logo & Title */}
          <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
            <div className="w-9 h-9 rounded-[10px] overflow-hidden border border-white/15 shadow-glow group-hover:scale-105 transition-transform duration-300 bg-charcoal">
              <img src="/logo.jpg" alt="AnimeX Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-headline text-xl font-bold text-warm-white tracking-tight group-hover:text-vermilion transition-colors duration-300">
              AnimeX
            </span>
          </Link>

          <p className="font-body text-warm-white/40 text-xs leading-relaxed max-w-xs">
            © {new Date().getFullYear()} AnimeX.{" "}
            <motion.span
              whileHover={{ color: "#D32F2F" }}
              className="font-jp text-warm-white/70 inline-block cursor-pointer transition-colors duration-300 hover:drop-shadow-[0_0_12px_rgba(211,47,47,0.8)]"
            >
              物語 発見。
            </motion.span>{" "}
            Developed by Aseer Awsaf.
          </p>
          <p className="font-label text-[10px] text-warm-white/20 uppercase tracking-widest mt-2">
            Powered by AniList API — Data belongs to respective rights holders.
          </p>
        </div>

        <nav className="flex gap-7">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-label text-[10px] uppercase tracking-widest text-warm-white/30 hover:text-warm-white transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
