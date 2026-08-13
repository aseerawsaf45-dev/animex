import Link from "next/link";
import { AnimeCard } from "@/components/anime/AnimeCard";
import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { CinematicHero } from "@/components/home/CinematicHero";
import { InkStrokeReveal } from "@/components/motion/InkStrokeReveal";
import { ArrowRight, Sparkles, Dna } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function getTrending() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/anime/trending?perPage=16`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function getSeasonal() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/anime/seasonal?perPage=10`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [trending, seasonal] = await Promise.all([getTrending(), getSeasonal()]);
  const session = await auth();

  let onboardingDone = false;
  if (session?.user?.id) {
    const userPref = await prisma.userPreference.findUnique({
      where: { userId: session.user.id }
    });
    onboardingDone = !!userPref?.onboardingDone;
  }

  return (
    <div className="relative">
      {/* ─── 01 — CINEMATIC HERO REVEAL ─── */}
      <CinematicHero />

      {/* Prominent Onboarding Banner when loading site before taste profile is built */}
      {!onboardingDone && (
        <section className="pt-12 pb-4">
          <div className="page-container">
            <FadeIn>
              <div className="p-8 md:p-10 rounded-[28px] glass border border-vermilion/30 bg-vermilion/10 shadow-glow flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl gradient-vermilion flex items-center justify-center shrink-0 shadow-glow">
                    <Dna className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-headline text-2xl font-bold text-warm-white">
                      Build Your Anime Taste Profile First
                    </h3>
                    <p className="font-body text-sm text-warm-white/70 mt-1 max-w-xl">
                      Answer 5 quick questions about your favorite genres, themes, & eras so AnimeX can calculate your exact scores!
                    </p>
                  </div>
                </div>
                <Link
                  href="/onboarding"
                  className="px-8 py-4 rounded-xl gradient-vermilion text-white font-label text-xs uppercase tracking-widest font-bold shadow-glow shrink-0 inline-flex items-center gap-2 hover:opacity-95 transition-opacity"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Questionnaire</span>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ─── SECTION 2: Picked For You ─── */}
      <section className="py-16 relative overflow-hidden">
        <div className="page-container">
          <FadeIn className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
            <div>
              <span className="text-vermilion font-label uppercase tracking-[0.2em] text-xs font-bold mb-2 block">
                Personalized
              </span>
              <InkStrokeReveal>
                <h2 className="font-headline text-4xl md:text-5xl text-warm-white">Picked For You</h2>
              </InkStrokeReveal>
            </div>
            <Link
              href="/recommendations"
              className="text-warm-white/60 hover:text-vermilion font-label text-xs uppercase tracking-widest flex items-center gap-2 transition-colors"
            >
              View All Recommendations <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>

          <Stagger className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {trending.slice(0, 6).map((anime: any, i: number) => (
              <StaggerItem key={anime.id}>
                <AnimeCard anime={anime} index={i} showMatch matchScore={94 - i * 2} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ─── SECTION 3: Trending This Season ─── */}
      <section className="py-16 border-t border-white/10">
        <div className="page-container">
          <FadeIn className="flex justify-between items-end mb-12">
            <div>
              <span className="text-vermilion font-label uppercase tracking-[0.2em] text-xs font-bold mb-2 block">
                Trending This Season
              </span>
              <InkStrokeReveal>
                <h2 className="font-headline text-4xl md:text-5xl text-warm-white">Currently Airing</h2>
              </InkStrokeReveal>
            </div>
            <Link
              href="/discover"
              className="text-warm-white/60 hover:text-vermilion font-label text-xs uppercase tracking-widest flex items-center gap-2 transition-colors"
            >
              Discover More Anime <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>

          <Stagger className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {seasonal.slice(0, 6).map((anime: any, i: number) => (
              <StaggerItem key={anime.id}>
                <AnimeCard anime={anime} index={i} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </div>
  );
}
