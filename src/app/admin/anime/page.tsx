import { FadeIn } from "@/components/motion/FadeIn";
import { AnimeGrid } from "@/components/anime/AnimeGrid";
import { Search, RefreshCw } from "lucide-react";

export default function AdminAnimePage() {
  return (
    <div>
      <FadeIn>
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30" />
            <input
              placeholder="Search anime in database..."
              className="w-full h-11 pl-11 pr-4 rounded-[12px] glass border border-white/10 bg-transparent text-warm-white placeholder:text-warm-white/25 font-body text-sm outline-none focus:border-vermilion/40 transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-[12px] gradient-vermilion text-white font-label text-[11px] uppercase tracking-wider shadow-glow">
            <RefreshCw className="w-4 h-4" /> Sync
          </button>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="text-center py-20 text-warm-white/25">
          <p className="font-jp text-4xl mb-4 opacity-30">空</p>
          <p className="font-body">No anime in database yet. Click Sync to import from AniList.</p>
        </div>
      </FadeIn>
    </div>
  );
}
