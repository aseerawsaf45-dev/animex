import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

const NAV_LINKS = [
  { href: "/admin",               label: "Dashboard" },
  { href: "/admin/anime",         label: "Anime"     },
  { href: "/admin/users",         label: "Users"     },
  { href: "/admin/models",        label: "ML Models" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  // In production, check for ADMIN role
  // if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen pt-20">
      <div className="page-container py-8">
        {/* Admin header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-[8px] gradient-vermilion flex items-center justify-center">
            <span className="font-jp text-white text-xs font-bold">管</span>
          </div>
          <h1 className="font-headline text-xl font-bold">Admin</h1>
        </div>

        <div className="flex gap-1 p-1 glass rounded-[14px] w-fit mb-8">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-5 py-2 rounded-[10px] font-label text-[11px] uppercase tracking-wider text-warm-white/40 hover:text-warm-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        {children}
      </div>
    </div>
  );
}
