import { FadeIn } from "@/components/motion/FadeIn";
import { InkStrokeReveal } from "@/components/motion/InkStrokeReveal";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="pt-28 pb-24 relative overflow-hidden">
      <div className="japanese-deco text-[160px] md:text-[240px] font-bold leading-none top-20 right-[-3%] opacity-5 pointer-events-none select-none -z-10">
        利用規約
      </div>

      <div className="page-container max-w-4xl">
        <FadeIn>
          <div className="mb-12">
            <div className="flex items-center gap-2.5 mb-3">
              <FileText className="w-4 h-4 text-vermilion" />
              <span className="font-label text-[10px] text-vermilion uppercase tracking-[0.25em] font-bold">
                LEGAL AGREEMENT
              </span>
            </div>
            <InkStrokeReveal>
              <h1 className="font-headline text-4xl md:text-5xl font-bold text-warm-white tracking-tight mb-4">
                Terms of Service
              </h1>
            </InkStrokeReveal>
            <p className="font-body text-warm-white/60 text-sm md:text-base">
              Last updated: August 2026. Please read these terms carefully before exploring AnimeX.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-8">
          <FadeIn delay={0.1}>
            <div className="glass-card rounded-[24px] p-8 border border-white/10 shadow-2xl space-y-4">
              <h2 className="font-headline text-xl font-bold text-warm-white">1. Acceptance of Terms</h2>
              <p className="font-body text-sm text-warm-white/70 leading-relaxed">
                By accessing and using AnimeX, you acknowledge and agree to comply with these terms. If you do not agree with any part of these terms, please discontinue using the service.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="glass-card rounded-[24px] p-8 border border-white/10 shadow-2xl space-y-4">
              <h2 className="font-headline text-xl font-bold text-warm-white">2. Platform Purpose & Usage</h2>
              <p className="font-body text-sm text-warm-white/70 leading-relaxed">
                AnimeX is an anime recommendation, discovery, and watchlist tracking platform. It is intended for non-commercial personal entertainment and curation. Automated abuse, scrapers, or attempts to disrupt service stability are prohibited.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="glass-card rounded-[24px] p-8 border border-white/10 shadow-2xl space-y-4">
              <h2 className="font-headline text-xl font-bold text-warm-white">3. Intellectual Property</h2>
              <p className="font-body text-sm text-warm-white/70 leading-relaxed">
                All branding, UI design, recommendation logic, and visual assets unique to AnimeX belong to the creators. Anime cover arts, screenshots, character names, and synopses are copyrights of their respective production companies and licensors.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.25}>
            <div className="glass-card rounded-[24px] p-8 border border-white/10 shadow-2xl space-y-4">
              <h2 className="font-headline text-xl font-bold text-warm-white">4. Limitation of Liability</h2>
              <p className="font-body text-sm text-warm-white/70 leading-relaxed">
                AnimeX provides suggestions and data on an "as is" basis. While we strive to maintain uninterrupted availability and accurate anime cataloging, we are not liable for any third-party API downtimes or discrepancies in external metadata.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
