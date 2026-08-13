"use client";

import { useState } from "react";
import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { RefreshCw, Users, Film, Sparkles, BarChart2 } from "lucide-react";

export default function AdminDashboard() {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const stats = [
    { icon: <Film className="w-5 h-5" />,     label: "Total Anime",        value: "—" },
    { icon: <Users className="w-5 h-5" />,    label: "Users",              value: "—" },
    { icon: <Sparkles className="w-5 h-5" />, label: "Recommendations",    value: "—" },
    { icon: <BarChart2 className="w-5 h-5" />,label: "Avg Match Score",    value: "—" },
  ];

  const triggerSync = async () => {
    setSyncing(true);
    setResult(null);
    try {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": "dev-admin-secret" },
        body: JSON.stringify({ page: 1, perPage: 50 }),
      });
      setResult(await res.json());
    } catch (e: any) {
      setResult({ error: e.message });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div>
      {/* KPI cards */}
      <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon, label, value }) => (
          <StaggerItem key={label}>
            <div className="glass-card p-5 rounded-[18px]">
              <div className="flex items-center gap-3 mb-3 text-warm-white/40">{icon}<span className="font-label text-[10px] uppercase tracking-widest">{label}</span></div>
              <p className="font-headline text-3xl font-bold text-warm-white">{value}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      {/* Data Sync */}
      <FadeIn delay={0.2}>
        <div className="glass-card rounded-[20px] p-8 space-y-5">
          <div>
            <h2 className="font-headline text-xl font-bold mb-1">Data Synchronization</h2>
            <p className="text-warm-white/40 font-body text-sm">
              Fetch top trending anime from AniList GraphQL API and sync to the Neon PostgreSQL database.
            </p>
          </div>

          <button
            onClick={triggerSync}
            disabled={syncing}
            className="flex items-center gap-2.5 px-6 py-3 rounded-[12px] gradient-vermilion text-white font-label text-[11px] uppercase tracking-widest shadow-glow hover:shadow-glow-lg transition-shadow disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Sync Trending Anime (50)"}
          </button>

          {result && (
            <div className={`p-4 rounded-[12px] font-label text-[12px] ${result.success ? "bg-green-950/40 border border-green-500/20 text-green-400" : "bg-red-950/40 border border-red-500/20 text-red-400"}`}>
              <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
}
