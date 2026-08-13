import Link from "next/link";
import { FadeIn } from "@/components/motion/FadeIn";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
      <FadeIn>
        <div className="space-y-6">
          <p className="font-jp text-8xl font-bold opacity-[0.06] select-none leading-none">
            見つからない
          </p>
          <div className="space-y-2">
            <h1 className="font-headline text-3xl font-bold">This Story Could Not Be Found</h1>
            <p className="font-jp text-sm text-warm-white/30">この物語は見つかりませんでした</p>
          </div>
          <p className="text-warm-white/40 font-body max-w-sm mx-auto">
            The page you were looking for doesn't exist or may have been moved.
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full gradient-vermilion text-white font-label text-[12px] uppercase tracking-widest shadow-glow hover:shadow-glow-lg transition-shadow"
            >
              Return Home
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
