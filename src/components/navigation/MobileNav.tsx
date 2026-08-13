"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Sparkles, Bookmark, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const tabs = [
  { href: "/",               label: "Home",    icon: Home      },
  { href: "/discover",       label: "Discover",icon: Compass   },
  { href: "/recommendations",label: "For You", icon: Sparkles  },
  { href: "/watchlist",      label: "Saved",   icon: Bookmark  },
  { href: "/profile",        label: "Me",      icon: User      },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] md:hidden glass border-t border-white/[0.06]">
      <div className="flex items-stretch h-16">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 relative",
                "transition-colors duration-200",
                isActive ? "text-vermilion" : "text-warm-white/35 hover:text-warm-white/70"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-vermilion rounded-full"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                />
              )}
              <Icon className={cn("w-5 h-5 transition-transform duration-200", isActive && "scale-110")} />
              <span className="font-label text-[9px] uppercase tracking-[0.1em]">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
