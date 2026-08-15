import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { TasteDNAChart } from "@/components/recommendations/TasteDNAChart";
import Link from "next/link";
import { Settings, Dna, BookOpen, Clock, Sparkles, Shield, User, Flame, Compass, ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?from=/profile");

  const [userPref, watchlistCount, ratingCount, watchHistoryCount] = await Promise.all([
    prisma.userPreference.findUnique({
      where: { userId: session.user.id }
    }),
    prisma.watchlist.count({
      where: { userId: session.user.id }
    }).catch(() => 0),
    prisma.rating.count({
      where: { userId: session.user.id }
    }).catch(() => 0),
    prisma.watchHistory.count({
      where: { userId: session.user.id }
    }).catch(() => 0),
  ]);

  const stats = [
    { label: "In Watchlist", value: watchlistCount > 0 ? watchlistCount : "—", icon: BookOpen },
    { label: "Anime Rated",  value: ratingCount > 0 ? ratingCount : "—", icon: Flame },
    { label: "History Log",  value: watchHistoryCount > 0 ? watchHistoryCount : "—", icon: Clock },
  ];

  return (
    <div className="pt-28 pb-24 relative overflow-hidden">
      {/* Cinematic Ambient Glow Orbs */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-vermilion/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="japanese-deco text-[180px] md:text-[260px] font-bold leading-none top-20 right-[-4%] opacity-5 pointer-events-none select-none -z-10">
        自己
      </div>

      <div className="page-container max-w-4xl">
        {/* Profile Hero Card */}
        <FadeIn>
          <div className="relative rounded-[32px] p-8 md:p-10 mb-10 glass-card border border-white/12 shadow-2xl overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-8 group">
            <div className="relative shrink-0">
              <div className="w-28 h-28 rounded-[24px] overflow-hidden border-2 border-vermilion/40 shadow-glow group-hover:scale-105 transition-transform duration-500 bg-charcoal">
                {session.user.image ? (
                  <img src={session.user.image} alt={session.user.name || "User"} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full gradient-vermilion flex items-center justify-center text-white text-4xl font-bold font-headline">
                    {(session.user.name?.[0] || session.user.email?.[0] || "U").toUpperCase()}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full gradient-vermilion border-2 border-ink flex items-center justify-center text-white shadow-glow">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-label text-[10px] text-vermilion uppercase tracking-[0.25em] font-bold">
                  {userPref?.onboardingDone ? "Taste DNA Calibrated" : "Initiate Profile"}
                </span>
              </div>
              <h1 className="font-headline text-3xl md:text-4xl font-bold mb-1 text-warm-white tracking-tight">
                {session.user.name || "Anime Explorer"}
              </h1>
              <p className="text-warm-white/40 font-body text-sm mb-6">{session.user.email}</p>

              {/* Dynamic Metrics */}
              <div className="grid grid-cols-3 gap-6 pt-2 border-t border-white/10">
                {stats.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="space-y-0.5">
                    <p className="font-headline text-2xl font-bold text-warm-white flex items-center gap-2">
                      <span>{value}</span>
                    </p>
                    <p className="font-label text-[10px] text-warm-white/40 uppercase tracking-wider flex items-center gap-1">
                      <Icon className="w-3 h-3 text-vermilion/80" />
                      <span>{label}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="self-start md:self-center shrink-0">
              <Link
                href="/settings"
                className="flex items-center gap-2 px-5 py-3 rounded-2xl glass border border-white/10 text-warm-white/70 hover:text-warm-white hover:border-white/30 hover:bg-white/5 transition-all font-label text-xs uppercase tracking-wider font-bold shadow-lg"
              >
                <Settings className="w-4 h-4 text-vermilion" />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* Quick Nav Cards */}
        <Stagger className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { href: "/taste",     icon: <Dna className="w-5 h-5" />,     label: "Anime DNA Radar",   desc: "Full 7-axis narrative map" },
            { href: "/watchlist", icon: <BookOpen className="w-5 h-5" />, label: "Personal Watchlist", desc: "Track episodes & bookmarks" },
            { href: "/discover",  icon: <Compass className="w-5 h-5" />,  label: "Deep Discovery",    desc: "AI vector recommendation pool" },
          ].map(({ href, icon, label, desc }) => (
            <StaggerItem key={href}>
              <Link
                href={href}
                className="group flex items-center gap-4 p-5 glass-card rounded-[22px] border border-white/[0.08] hover:border-vermilion/40 hover:bg-vermilion/5 transition-all duration-300 hover:-translate-y-1 shadow-lg relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-[16px] gradient-vermilion flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform shrink-0">
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-label text-[13px] font-bold text-warm-white group-hover:text-vermilion transition-colors flex items-center justify-between">
                    <span>{label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                  <p className="font-body text-xs text-warm-white/40 truncate mt-0.5">{desc}</p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Taste DNA Section with Live Edit Option */}
        <FadeIn delay={0.15}>
          <TasteDNAChart userPref={userPref} showEditButton={true} />
        </FadeIn>
      </div>
    </div>
  );
}
