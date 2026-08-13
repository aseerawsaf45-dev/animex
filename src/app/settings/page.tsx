import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

const SECTIONS = [
  {
    title: "Recommendation Preferences",
    settings: [
      { label: "Prefer popular anime",    desc: "Prioritize widely-known titles",      key: "popular"        },
      { label: "Discover hidden gems",    desc: "Surface underrated anime",             key: "hidden_gems"    },
      { label: "Include older anime",     desc: "Recommendations from any era",         key: "older_anime"    },
      { label: "Adventure outside taste", desc: "Occasionally recommend new genres",    key: "adventure"      },
    ],
  },
  {
    title: "Privacy & Data",
    settings: [
      { label: "Share watch history",     desc: "Used to improve collaborative recommendations", key: "share_history" },
    ],
  },
];

function Toggle({ defaultChecked = true }: { defaultChecked?: boolean }) {
  return (
    <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${defaultChecked ? "bg-vermilion" : "bg-surface"}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${defaultChecked ? "translate-x-7" : "translate-x-1"}`} />
    </div>
  );
}

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?from=/settings");

  return (
    <div className="pt-28 pb-20">
      <div className="page-container max-w-3xl">
        <FadeIn>
          <div className="mb-12">
            <p className="font-jp text-[10px] text-warm-white/30 tracking-[0.4em] uppercase mb-2">設定</p>
            <h1 className="font-headline text-4xl font-bold mb-2">Settings</h1>
          </div>
        </FadeIn>

        <div className="space-y-10">
          {SECTIONS.map(({ title, settings }) => (
            <FadeIn key={title}>
              <div className="space-y-4">
                <h2 className="font-label text-[11px] uppercase tracking-widest text-warm-white/30">{title}</h2>
                <div className="glass-card rounded-[20px] overflow-hidden divide-y divide-white/[0.05]">
                  {settings.map(({ label, desc, key }) => (
                    <div key={key} className="flex items-center justify-between p-5">
                      <div>
                        <p className="font-label text-[14px] font-medium text-warm-white">{label}</p>
                        <p className="font-body text-[12px] text-warm-white/35 mt-0.5">{desc}</p>
                      </div>
                      <Toggle defaultChecked />
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}

          {/* Account */}
          <FadeIn>
            <div className="space-y-4">
              <h2 className="font-label text-[11px] uppercase tracking-widest text-warm-white/30">Account</h2>
              <div className="glass-card rounded-[20px] p-6 space-y-4">
                <div className="flex items-center gap-4">
                  {session.user.image && (
                    <img src={session.user.image} alt="Avatar" className="w-12 h-12 rounded-[10px]" />
                  )}
                  <div>
                    <p className="font-label text-[14px] font-medium text-warm-white">{session.user.name}</p>
                    <p className="font-body text-[12px] text-warm-white/35">{session.user.email}</p>
                  </div>
                </div>
                <form action="/api/auth/signout" method="POST">
                  <button type="submit" className="px-5 py-2.5 rounded-[10px] border border-red-500/30 text-red-400 font-label text-[11px] uppercase tracking-wider hover:bg-red-500/10 transition-colors">
                    Sign Out
                  </button>
                </form>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
