import { FadeIn } from "@/components/motion/FadeIn";
import { InkStrokeReveal } from "@/components/motion/InkStrokeReveal";
import { Sparkles, Heart, Compass, Zap } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="pt-28 pb-24 relative overflow-hidden">
      <div className="japanese-deco text-[160px] md:text-[240px] font-bold leading-none top-20 right-[-3%] opacity-5 pointer-events-none select-none -z-10">
        物語
      </div>

      <div className="page-container max-w-4xl">
        <FadeIn>
          <div className="mb-12">
            <div className="flex items-center gap-2.5 mb-3">
              <Sparkles className="w-4 h-4 text-vermilion" />
              <span className="font-label text-[10px] text-vermilion uppercase tracking-[0.25em] font-bold">
                ABOUT ANIMEX
              </span>
            </div>
            <InkStrokeReveal>
              <h1 className="font-headline text-4xl md:text-5xl font-bold text-warm-white tracking-tight mb-4">
                Redefining How Anime is Discovered
              </h1>
            </InkStrokeReveal>
            <p className="font-body text-warm-white/60 text-sm md:text-base leading-relaxed">
              AnimeX was built to solve the universal anime dilemma: spending more time browsing endlessly than actually watching stories you fall in love with.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-8">
          <FadeIn delay={0.1}>
            <div className="glass-card rounded-[24px] p-8 md:p-10 border border-white/10 shadow-2xl space-y-4">
              <h2 className="font-headline text-2xl font-bold text-warm-white flex items-center gap-2.5">
                <Compass className="w-5 h-5 text-vermilion" />
                The Mission
              </h2>
              <p className="font-body text-sm md:text-base text-warm-white/70 leading-relaxed">
                Generic recommendation lists often loop the same mainstream hits. AnimeX calibrates your unique taste profile based on narrative pacing, emotional atmosphere, protagonist archetypes, and hidden gems you actually care about.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card rounded-[24px] p-7 border border-white/10 shadow-xl space-y-3">
                <div className="w-10 h-10 rounded-xl gradient-vermilion flex items-center justify-center text-white shadow-glow">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-headline text-lg font-bold text-warm-white">Taste DNA Radar</h3>
                <p className="font-body text-xs md:text-sm text-warm-white/60 leading-relaxed">
                  A dynamic 6-axis power radar that maps your preference for Sakuga action, mind games, worldbuilding, emotional weight, supernatural lore, and high-hype climaxes.
                </p>
              </div>

              <div className="glass-card rounded-[24px] p-7 border border-white/10 shadow-xl space-y-3">
                <div className="w-10 h-10 rounded-xl gradient-vermilion flex items-center justify-center text-white shadow-glow">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="font-headline text-lg font-bold text-warm-white">Vibe & Mood Selector</h3>
                <p className="font-body text-xs md:text-sm text-warm-white/60 leading-relaxed">
                  Real-time channel filtering that instantly serves anime tuned to whether you want intense adrenaline, dark psychology, cozy healing, or pure comedy.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="glass-card rounded-[24px] p-8 border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-headline text-xl font-bold text-warm-white mb-1">
                  Ready to discover your next favorite series?
                </h3>
                <p className="font-body text-xs md:text-sm text-warm-white/50">
                  Build your Anime Taste Profile in under 60 seconds.
                </p>
              </div>
              <Link
                href="/recommendations"
                className="px-6 py-3 rounded-xl gradient-vermilion text-white font-label text-xs uppercase tracking-widest font-bold shadow-glow hover:opacity-90 transition-opacity shrink-0"
              >
                Explore Recommendations
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
