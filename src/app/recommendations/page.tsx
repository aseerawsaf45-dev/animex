import { FadeIn } from "@/components/motion/FadeIn";
import { AnimeCard } from "@/components/anime/AnimeCard";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { MoodSelector } from "@/components/recommendations/MoodSelector";
import { SurpriseMeButton } from "@/components/recommendations/SurpriseMeButton";
import { InkStrokeReveal } from "@/components/motion/InkStrokeReveal";
import { Sparkles, ArrowRight, Compass, Flame, Wand2, Shield, Eye, Layers, Dna } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateHybridRecommendations, getColdStartRecommendations } from "@/lib/recommendations/engine";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RecommendationsPage() {
  const session = await auth();

  let recs: any[] = [];
  let userPref: any = null;

  if (session?.user?.id) {
    userPref = await prisma.userPreference.findUnique({
      where: { userId: session.user.id }
    });
    recs = await generateHybridRecommendations(session.user.id, 24);
  } else {
    recs = await getColdStartRecommendations(24);
  }

  // Determine dynamic section title based on User Onboarding Answers
  const userGenres: string[] = (userPref?.genreWeights as string[]) || [];
  const dynamicContextTitle = userGenres.length >= 2
    ? `BECAUSE YOU ENJOY ${userGenres[0].toUpperCase()} & ${userGenres[1].toUpperCase()}`
    : userGenres.length === 1
    ? `BECAUSE YOU ENJOY ${userGenres[0].toUpperCase()} ANIME`
    : "BASED ON YOUR TASTE PROFILE";

  const topPick = recs[0];
  const becauseYouLovedPicks = recs.slice(1, 5);
  const sameVibePicks = recs.slice(5, 9);
  const hiddenGemsPicks = recs.slice(9, 13);
  const trendingWorldPicks = recs.slice(13, 19);

  return (
    <div className="pt-28 pb-24">
      <div className="page-container">
        {/* Onboarding Questionnaire Prompt Banner if not done */}
        {!userPref?.onboardingDone && (
          <FadeIn>
            <div className="mb-10 p-6 md:p-8 rounded-[24px] glass border border-vermilion/30 bg-vermilion/10 shadow-glow flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-vermilion flex items-center justify-center shrink-0 shadow-glow">
                  <Dna className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-headline text-xl font-bold text-warm-white">
                    Build Your Anime Taste Profile First
                  </h3>
                  <p className="font-body text-xs text-warm-white/70 mt-0.5">
                    Answer 5 quick questions about your favorite genres, themes, & eras so AnimeX can calculate your exact scores!
                  </p>
                </div>
              </div>
              <Link
                href="/onboarding"
                className="px-6 py-3 rounded-xl gradient-vermilion text-white font-label text-xs uppercase tracking-widest font-bold shadow-glow shrink-0 inline-flex items-center gap-2 hover:opacity-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Questionnaire</span>
              </Link>
            </div>
          </FadeIn>
        )}

        {/* Hero Banner */}
        <FadeIn>
          <div className="relative rounded-[28px] overflow-hidden p-10 md:p-14 mb-14 cinematic-gradient border border-white/[0.08] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="japanese-deco text-[140px] md:text-[220px] font-bold leading-none top-1/2 -translate-y-1/2 right-[-2%] opacity-10 pointer-events-none select-none">
              推薦
            </div>

            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-4 h-4 text-vermilion" />
                <span className="font-label text-[11px] text-vermilion uppercase tracking-[0.25em] font-bold">
                  Handcrafted For Your Anime Taste
                </span>
              </div>
              <h1 className="font-headline text-4xl md:text-6xl font-bold mb-3 tracking-tight text-warm-white">
                Your Anime Universe
              </h1>
              <p className="font-body text-warm-white/60 text-base md:text-lg leading-relaxed">
                You tell us what you love. <span className="text-warm-white font-semibold">AnimeX finds what you should watch next.</span>
              </p>
            </div>

            {/* "Surprise Me" Action */}
            <div className="relative z-10 shrink-0">
              <SurpriseMeButton candidates={recs.map((r) => r.anime)} />
            </div>
          </div>
        </FadeIn>

        {/* 01 — YOUR NEXT OBSESSION (Top Match Showcase) */}
        {topPick && (
          <section className="mb-16">
            <FadeIn>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-vermilion font-label uppercase tracking-[0.2em] text-[11px] font-bold mb-1 block">
                    01 — Top Recommendation
                  </span>
                  <InkStrokeReveal>
                    <h2 className="font-headline text-3xl md:text-4xl font-bold text-warm-white">YOUR NEXT OBSESSION</h2>
                  </InkStrokeReveal>
                </div>
              </div>

              <div className="p-8 md:p-10 rounded-[28px] glass border border-white/12 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row gap-8 items-center">
                <div className="w-48 md:w-56 aspect-[2/3] rounded-[20px] overflow-hidden border border-white/15 shadow-2xl shrink-0 bg-charcoal">
                  <img
                    src={topPick.anime?.coverImage?.extraLarge || topPick.anime?.coverImage?.large || topPick.anime?.coverImage}
                    alt="Top Pick"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-5 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1.5 rounded-full gradient-vermilion text-white font-label text-[11px] uppercase tracking-widest font-bold shadow-glow">
                      {topPick.matchPercentage || 98}% Match
                    </span>
                    <span className="font-label text-xs uppercase tracking-widest text-warm-white/50">
                      Highest Taste Affinity
                    </span>
                  </div>

                  <h3 className="font-headline text-3xl md:text-5xl font-bold text-warm-white">
                    {topPick.anime?.titleEnglish || topPick.anime?.titleRomaji || "Featured Match"}
                  </h3>

                  <p className="font-body text-warm-white/70 text-sm md:text-base leading-relaxed line-clamp-3">
                    {topPick.anime?.synopsis?.replace(/<[^>]*>?/gm, "") || "A tailored discovery pick based on your favorite anime styles."}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-4 items-center">
                    <Link
                      href={`/anime/${topPick.anime?.id}`}
                      className="px-8 py-3.5 rounded-xl gradient-vermilion text-white font-label text-xs uppercase tracking-widest shadow-glow inline-flex items-center gap-2 font-bold"
                    >
                      <span>Explore Anime</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </FadeIn>
          </section>
        )}

        {/* 04 — WHAT ARE YOU IN THE MOOD FOR? */}
        <section className="mb-16">
          <FadeIn>
            <MoodSelector />
          </FadeIn>
        </section>

        {/* 02 — DYNAMIC BECAUSE YOU LOVED / ENJOY... */}
        {becauseYouLovedPicks.length > 0 && (
          <section className="mb-16">
            <FadeIn className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
              <div>
                <span className="text-vermilion font-label uppercase tracking-[0.2em] text-[11px] font-bold mb-1 block">
                  02 — Based on Your Favorites
                </span>
                <InkStrokeReveal>
                  <h2 className="font-headline text-3xl font-bold text-warm-white">{dynamicContextTitle}</h2>
                </InkStrokeReveal>
              </div>
            </FadeIn>

            <Stagger className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {becauseYouLovedPicks.map((rec: any, i: number) => (
                <StaggerItem key={`byl-${rec.anime?.id || i}`}>
                  <AnimeCard
                    anime={rec.anime}
                    index={i}
                    showMatch
                    matchScore={rec.matchPercentage}
                    reason="Direct match with your favorite genres"
                  />
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        )}

        {/* 03 — SAME VIBE. DIFFERENT STORY. */}
        {sameVibePicks.length > 0 && (
          <section className="mb-16">
            <FadeIn className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
              <div>
                <span className="text-vermilion font-label uppercase tracking-[0.2em] text-[11px] font-bold mb-1 block">
                  03 — Similar Atmosphere
                </span>
                <InkStrokeReveal>
                  <h2 className="font-headline text-3xl font-bold text-warm-white">SAME VIBE. DIFFERENT STORY.</h2>
                </InkStrokeReveal>
              </div>
            </FadeIn>

            <Stagger className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {sameVibePicks.map((rec: any, i: number) => (
                <StaggerItem key={`sv-${rec.anime?.id || i}`}>
                  <AnimeCard
                    anime={rec.anime}
                    index={i}
                    showMatch
                    matchScore={rec.matchPercentage}
                    reason="Identical tone & atmosphere"
                  />
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        )}

        {/* 05 — HIDDEN GEMS (Full width recommendation grid) */}
        <section className="mb-16">
          <FadeIn className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
            <div>
              <span className="text-vermilion font-label uppercase tracking-[0.2em] text-[11px] font-bold mb-1 block">
                04 — Hidden Treasures
              </span>
              <InkStrokeReveal>
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-warm-white">HIDDEN GEMS FOR YOU</h2>
              </InkStrokeReveal>
            </div>
          </FadeIn>

          <Stagger className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {hiddenGemsPicks.map((rec: any, i: number) => (
              <StaggerItem key={`hg-${rec.anime?.id || i}`}>
                <AnimeCard
                  anime={rec.anime}
                  index={i}
                  showMatch
                  matchScore={rec.matchPercentage}
                  reason="Critically acclaimed masterpieces worth discovering"
                />
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* 06 — TRENDING IN YOUR WORLD */}
        {trendingWorldPicks.length > 0 && (
          <section>
            <FadeIn className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
              <div>
                <span className="text-vermilion font-label uppercase tracking-[0.2em] text-[11px] font-bold mb-1 block">
                  05 — Community Favorites
                </span>
                <InkStrokeReveal>
                  <h2 className="font-headline text-3xl font-bold text-warm-white">TRENDING IN YOUR WORLD</h2>
                </InkStrokeReveal>
              </div>
            </FadeIn>

            <Stagger className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {trendingWorldPicks.map((rec: any, i: number) => (
                <StaggerItem key={`tw-${rec.anime?.id || i}`}>
                  <AnimeCard
                    anime={rec.anime}
                    index={i}
                    showMatch
                    matchScore={rec.matchPercentage}
                    reason="Popular among fans with similar tastes"
                  />
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        )}
      </div>
    </div>
  );
}
