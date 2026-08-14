"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, User as UserIcon, ArrowRight, AlertCircle, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        // Register user via API
        const regRes = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const regData = await regRes.json();
        if (!regRes.ok) {
          throw new Error(regData.error || "Registration failed");
        }

        // Auto sign in after registration
        const authRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (authRes?.error) {
          setMode("signin");
          setError("Account created! Please sign in below.");
          return;
        }

        router.push("/onboarding");
        router.refresh();
      } else {
        // Sign in existing user
        const authRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (authRes?.error) {
          throw new Error("Invalid email or password. Please check your credentials.");
        }

        router.push("/onboarding");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-28 relative overflow-hidden">
      {/* Background Decor */}
      <div className="japanese-deco text-[160px] md:text-[240px] font-bold leading-none top-1/2 -translate-y-1/2 left-[-5%] opacity-5 pointer-events-none select-none">
        ログイン
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass rounded-[28px] p-8 md:p-10 border border-white/10 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-[8px] gradient-vermilion flex items-center justify-center shadow-glow">
                <span className="font-jp text-white font-bold text-sm">X</span>
              </div>
              <span className="font-headline text-2xl font-bold text-warm-white tracking-tight">
                AnimeX
              </span>
            </Link>
            <h1 className="font-ninja text-3xl font-bold text-warm-white mb-2">
              {mode === "signin" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="font-body text-warm-white/40 text-sm">
              {mode === "signin"
                ? "Sign in to access your personal recommendations & watchlist"
                : "Join AnimeX to build your personalized Anime DNA"}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex gap-1 p-1 glass rounded-full mb-8 border border-white/10">
            <button
              type="button"
              onClick={() => { setMode("signin"); setError(""); }}
              className={cn(
                "flex-1 py-2.5 rounded-full font-label text-[11px] uppercase tracking-widest transition-all duration-200",
                mode === "signin"
                  ? "gradient-vermilion text-white shadow-glow"
                  : "text-warm-white/40 hover:text-warm-white"
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode("signup"); setError(""); }}
              className={cn(
                "flex-1 py-2.5 rounded-full font-label text-[11px] uppercase tracking-widest transition-all duration-200",
                mode === "signup"
                  ? "gradient-vermilion text-white shadow-glow"
                  : "text-warm-white/40 hover:text-warm-white"
              )}
            >
              Sign Up
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-[14px] bg-vermilion/15 border border-vermilion/30 flex items-center gap-3 text-vermilion text-xs font-body">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <div>
                <label className="block font-label text-[11px] uppercase tracking-widest text-warm-white/50 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aseer Awsaf"
                    className="w-full h-12 pl-11 pr-4 rounded-[14px] glass border border-white/10 focus:border-vermilion/60 bg-transparent text-warm-white placeholder:text-warm-white/20 font-body text-sm outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-label text-[11px] uppercase tracking-widest text-warm-white/50 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aseer@example.com"
                  className="w-full h-12 pl-11 pr-4 rounded-[14px] glass border border-white/10 focus:border-vermilion/60 bg-transparent text-warm-white placeholder:text-warm-white/20 font-body text-sm outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-label text-[11px] uppercase tracking-widest text-warm-white/50 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-11 pr-4 rounded-[14px] glass border border-white/10 focus:border-vermilion/60 bg-transparent text-warm-white placeholder:text-warm-white/20 font-body text-sm outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 rounded-[14px] gradient-vermilion text-white font-label text-xs uppercase tracking-widest shadow-glow hover:opacity-95 transition-opacity flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === "signin" ? "Sign In to AnimeX" : "Create My Account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Guest Link */}
          <div className="text-center mt-8 pt-6 border-t border-white/[0.06]">
            <Link href="/" className="font-body text-xs text-warm-white/40 hover:text-warm-white transition-colors">
              Continue exploring as guest →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
