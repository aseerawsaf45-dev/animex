import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { TasteDNAChart } from "@/components/recommendations/TasteDNAChart";
import Link from "next/link";
import { Settings, Dna, BookOpen, Clock } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login?from=/profile");

  const stats = [
    { label: "Watched",  value: "—" },
    { label: "Episodes", value: "—" },
    { label: "Ratings",  value: "—" },
  ];

  return (
    <div className="pt-28 pb-20">
      <div className="page-container max-w-4xl">
        {/* Profile header */}
        <FadeIn>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-12">
            <div className="relative">
              <div className="w-24 h-24 rounded-[20px] overflow-hidden border-2 border-vermilion/30 shadow-glow">
                {session.user.image ? (
                  <img src={session.user.image} alt={session.user.name || "User"} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full gradient-vermilion flex items-center justify-center text-white text-3xl font-bold font-headline">
                    {(session.user.name?.[0] || session.user.email?.[0] || "U").toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <h1 className="font-headline text-4xl font-bold mb-1">{session.user.name || "Anime Fan"}</h1>
              <p className="text-warm-white/40 font-body mb-4">{session.user.email}</p>
              <div className="flex gap-8">
                {stats.map(({ label, value }) => (
                  <div key={label}>
                    <p className="font-headline text-2xl font-bold text-warm-white">{value}</p>
                    <p className="font-label text-[10px] text-warm-white/35 uppercase tracking-widest">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/settings"
              className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] glass border border-white/10 text-warm-white/50 hover:text-warm-white hover:border-white/20 transition-all font-label text-[11px] uppercase tracking-wider"
            >
              <Settings className="w-4 h-4" /> Settings
            </Link>
          </div>
        </FadeIn>

        {/* Quick links */}
        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { href: "/taste",     icon: <Dna className="w-5 h-5" />,     label: "Anime DNA",   desc: "Your taste visualization" },
            { href: "/watchlist", icon: <BookOpen className="w-5 h-5" />, label: "Watchlist",   desc: "Track your anime" },
            { href: "/history",   icon: <Clock className="w-5 h-5" />,   label: "History",     desc: "Your watch timeline" },
          ].map(({ href, icon, label, desc }) => (
            <StaggerItem key={href}>
              <Link
                href={href}
                className="group flex items-center gap-4 p-5 glass-card rounded-[18px] border border-white/[0.06] hover:border-white/15 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-11 h-11 rounded-[12px] gradient-vermilion flex items-center justify-center text-white shadow-glow group-hover:shadow-glow-lg transition-shadow">
                  {icon}
                </div>
                <div>
                  <p className="font-label text-[13px] font-semibold text-warm-white">{label}</p>
                  <p className="font-body text-[12px] text-warm-white/40">{desc}</p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Taste DNA visualization */}
        <FadeIn>
          <TasteDNAChart />
        </FadeIn>
      </div>
    </div>
  );
}
