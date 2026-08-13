import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/navigation/MobileNav";
import { PageTransition } from "@/components/motion/PageTransition";
import { ToriiTransition } from "@/components/motion/ToriiTransition";
import { SakuraParticles } from "@/components/motion/SakuraParticles";

export const metadata: Metadata = {
  title: {
    default: "AnimeX — Discover Your Next Story",
    template: "%s | AnimeX",
  },
  description: "AI-powered anime recommendations shaped around your unique taste and cinematic preferences.",
  keywords: ["anime", "recommendation", "discover", "AI", "watchlist"],
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "AnimeX — Discover Your Next Story",
    description: "AI-powered anime recommendations shaped around your unique taste.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AnimeX — Discover Your Next Story",
    description: "AI-powered anime recommendations shaped around your unique taste.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;600;700;900&family=Space+Grotesk:wght@300;400;500;600;700&family=Zen+Kaku+Gothic+New:wght@300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased overflow-x-hidden">
        <Providers>
          {/* Global Cherry Blossom Particle Animation across all pages */}
          <SakuraParticles count={25} isFixed />
          
          <Navbar />
          <ToriiTransition>
            <PageTransition>
              <main className="min-h-screen pb-20 md:pb-0">
                {children}
              </main>
            </PageTransition>
          </ToriiTransition>
          <Footer />
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
