import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Brain, Play, RotateCcw, Upload } from "lucide-react";

const MODEL_STATS = [
  { label: "Version",         value: "v1.0.0" },
  { label: "Algorithm",       value: "Hybrid CF+CBF" },
  { label: "Training Data",   value: "—" },
  { label: "Precision@10",    value: "—" },
  { label: "Recall@10",       value: "—" },
  { label: "NDCG",            value: "—" },
];

export default function AdminModelsPage() {
  return (
    <div>
      <FadeIn>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-[12px] gradient-vermilion flex items-center justify-center shadow-glow">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-headline text-xl font-bold">Recommendation Model</h2>
            <p className="text-warm-white/40 font-body text-sm">Cosine similarity + collaborative filtering hybrid</p>
          </div>
        </div>
      </FadeIn>

      <Stagger className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {MODEL_STATS.map(({ label, value }) => (
          <StaggerItem key={label}>
            <div className="glass-card p-5 rounded-[16px]">
              <p className="font-label text-[10px] text-warm-white/30 uppercase tracking-widest mb-2">{label}</p>
              <p className="font-headline text-xl font-bold text-warm-white">{value}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <FadeIn delay={0.2}>
        <div className="flex flex-wrap gap-3">
          {[
            { icon: <Play className="w-4 h-4" />,       label: "Evaluate Model",  style: "gradient-vermilion text-white shadow-glow" },
            { icon: <Upload className="w-4 h-4" />,     label: "Deploy Model",    style: "glass border border-white/10 text-warm-white/60 hover:text-warm-white hover:border-white/20" },
            { icon: <RotateCcw className="w-4 h-4" />,  label: "Rollback",        style: "glass border border-red-500/20 text-red-400 hover:bg-red-500/10" },
          ].map(({ icon, label, style }) => (
            <button key={label} className={`flex items-center gap-2 px-5 py-2.5 rounded-[12px] font-label text-[11px] uppercase tracking-wider transition-all ${style}`}>
              {icon} {label}
            </button>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
