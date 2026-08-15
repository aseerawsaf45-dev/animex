import { FadeIn } from "@/components/motion/FadeIn";
import { InkStrokeReveal } from "@/components/motion/InkStrokeReveal";
import { Shield, Sparkles } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-24 relative overflow-hidden">
      <div className="japanese-deco text-[160px] md:text-[240px] font-bold leading-none top-20 right-[-3%] opacity-5 pointer-events-none select-none -z-10">
        規約
      </div>

      <div className="page-container max-w-4xl">
        <FadeIn>
          <div className="mb-12">
            <div className="flex items-center gap-2.5 mb-3">
              <Shield className="w-4 h-4 text-vermilion" />
              <span className="font-label text-[10px] text-vermilion uppercase tracking-[0.25em] font-bold">
                LEGAL & SECURITY
              </span>
            </div>
            <InkStrokeReveal>
              <h1 className="font-headline text-4xl md:text-5xl font-bold text-warm-white tracking-tight mb-4">
                Privacy Policy
              </h1>
            </InkStrokeReveal>
            <p className="font-body text-warm-white/60 text-sm md:text-base">
              Last updated: August 2026. Your privacy and anime taste preferences are strictly safeguarded.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-8">
          <FadeIn delay={0.1}>
            <div className="glass-card rounded-[24px] p-8 border border-white/10 shadow-2xl space-y-4">
              <h2 className="font-headline text-xl font-bold text-warm-white">1. Information We Collect</h2>
              <p className="font-body text-sm text-warm-white/70 leading-relaxed">
                When you create an account on AnimeX, we collect your name, email address, and encrypted credentials. When you complete onboarding and interact with recommendations, we save your genre preferences, pacing selections, favorite archetypes, and watchlist data to personalize your anime discovery experience.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="glass-card rounded-[24px] p-8 border border-white/10 shadow-2xl space-y-4">
              <h2 className="font-headline text-xl font-bold text-warm-white">2. How We Use Your Data</h2>
              <p className="font-body text-sm text-warm-white/70 leading-relaxed">
                Your data is exclusively used to compute your personalized Anime Taste Radar, generate accurate anime suggestions, and synchronize your watchlist. We do not sell, rent, or trade your personal data to any third-party advertisers.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="glass-card rounded-[24px] p-8 border border-white/10 shadow-2xl space-y-4">
              <h2 className="font-headline text-xl font-bold text-warm-white">3. Third-Party Anime Metadata</h2>
              <p className="font-body text-sm text-warm-white/70 leading-relaxed">
                Anime titles, descriptions, studio credits, trailer links, and artwork are provided through the public AniList GraphQL API. All media copyrights remain the property of their respective studios, authors, and production committees.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.25}>
            <div className="glass-card rounded-[24px] p-8 border border-white/10 shadow-2xl space-y-4">
              <h2 className="font-headline text-xl font-bold text-warm-white">4. Data Deletion & Control</h2>
              <p className="font-body text-sm text-warm-white/70 leading-relaxed">
                You retain full control over your preferences. You can update or re-tune your taste profile at any time through your Profile or Settings, or request complete account removal by contacting support.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
