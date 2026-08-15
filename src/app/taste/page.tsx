import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FadeIn } from "@/components/motion/FadeIn";
import { TasteDNAChart } from "@/components/recommendations/TasteDNAChart";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Sparkles, ArrowRight, Dna, Layers } from "lucide-react";

export default async function TastePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?from=/taste");

  const userPref = await prisma.userPreference.findUnique({
    where: { userId: session.user.id }
  });

  const genres: string[] = (userPref?.genreWeights as string[]) || [];
  const themes: string[] = (userPref?.themeWeights as string[]) || [];
  const eras: string[] = (userPref?.preferredEras as string[]) || [];

  return (
    <div className="pt-28 pb-24 relative overflow-hidden">
      {/* Background Japanese Watermark */}
      <div className="japanese-deco text-[160px] md:text-[240px] font-bold leading-none top-20 right-[-3%] opacity-5 pointer-events-none select-none -z-10">
        味覚
      </div>

      <div className="page-container max-w-5xl">
        <FadeIn>
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-4 h-4 text-vermilion" />
              <span className="font-label text-[10px] text-vermilion uppercase tracking-[0.25em] font-bold">
                Your Personal Taste Profile
              </span>
            </div>
            <h1 className="font-headline text-4xl md:text-5xl font-bold mb-3 text-warm-white tracking-tight">
              Your Anime Taste DNA
            </h1>
            <p className="text-warm-white/60 font-body text-base max-w-2xl">
              An interactive visual map highlighting what you look for in anime — from high-energy battles and strategic mind games to emotional character journeys and rich fantasy worlds.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Main Visualizer */}
          <div className="lg:col-span-7">
            <FadeIn delay={0.1}>
              <TasteDNAChart userPref={userPref} showEditButton={true} />
            </FadeIn>
          </div>

          {/* Calibrated Preferences Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            <FadeIn delay={0.2}>
              <div className="glass-card rounded-[28px] p-8 border border-white/10 shadow-2xl space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="w-10 h-10 rounded-xl gradient-vermilion flex items-center justify-center text-white shadow-glow">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-headline text-xl font-bold text-warm-white">DNA Dimensions</h3>
                    <p className="font-body text-xs text-warm-white/40">Active calibration layers</p>
                  </div>
                </div>

                {/* Genres */}
                <div className="space-y-2">
                  <p className="font-label text-[10px] uppercase tracking-widest text-vermilion font-bold">Active Genres</p>
                  <div className="flex flex-wrap gap-2">
                    {genres.length > 0 ? (
                      genres.map((g) => (
                        <span key={g} className="px-3 py-1 rounded-full glass border border-white/10 text-xs font-label font-bold text-warm-white">
                          {g}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-warm-white/40 italic">Awaiting genre calibration</span>
                    )}
                  </div>
                </div>

                {/* Eras */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <p className="font-label text-[10px] uppercase tracking-widest text-vermilion font-bold">Aesthetic Eras</p>
                  <div className="flex flex-wrap gap-2">
                    {eras.length > 0 ? (
                      eras.map((e) => (
                        <span key={e} className="px-3 py-1 rounded-full glass border border-white/10 text-xs font-label font-bold text-warm-white">
                          {e.toUpperCase()}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-warm-white/40 italic">All eras inclusive</span>
                    )}
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-4 border-t border-white/10">
                  <Link
                    href="/recommendations"
                    className="w-full py-3.5 rounded-xl gradient-vermilion text-white font-label text-xs uppercase tracking-widest font-bold shadow-glow flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
                  >
                    <span>View Matched Recommendations</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
