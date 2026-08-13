import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { AnimeCard } from "@/components/anime/AnimeCard";
import { RadarChart } from "@/components/anime/RadarChart";

export default async function TastePage() {
  const session = await auth();
  if (!session?.user) redirect("/login?from=/taste");

  // Placeholder DNA data — in production this is derived from the user's feature vector
  const dnaData = [
    { label: "Action",      value: 0.82 },
    { label: "Drama",       value: 0.65 },
    { label: "Fantasy",     value: 0.74 },
    { label: "Romance",     value: 0.43 },
    { label: "Psychological",value: 0.91},
    { label: "Sci-Fi",      value: 0.58 },
  ];

  return (
    <div className="pt-28 pb-20">
      <div className="page-container">
        <FadeIn>
          <div className="mb-12">
            <p className="font-jp text-[10px] text-warm-white/30 tracking-[0.4em] uppercase mb-2">アニメDNA</p>
            <h1 className="font-headline text-5xl font-bold mb-3">Your Anime DNA</h1>
            <p className="text-warm-white/40 font-body text-lg">A visual map of your unique taste profile.</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <FadeIn delay={0.1}>
            <div className="glass-card rounded-[24px] p-10">
              <RadarChart data={dnaData} />
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="space-y-6">
              <h2 className="font-headline text-2xl font-bold">Your Top Genres</h2>
              <div className="space-y-3">
                {dnaData.sort((a,b) => b.value - a.value).map(({ label, value }) => (
                  <div key={label} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-label text-[12px] uppercase tracking-wider text-warm-white/70">{label}</span>
                      <span className="font-label text-[11px] text-vermilion">{Math.round(value * 100)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface overflow-hidden">
                      <div
                        className="h-full rounded-full gradient-vermilion transition-all duration-1000"
                        style={{ width: `${value * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
