import { auth } from "@/auth";

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isAuthRoute = pathname.startsWith("/login");
  const isPublicAsset = pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.includes(".");

  // 1. If unauthenticated user loads site (/ or /recommendations or /onboarding), send to /login first
  if (!isLoggedIn && !isAuthRoute && !isPublicAsset) {
    let from = pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }
    return Response.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, req.nextUrl));
  }

  // 2. If authenticated user lands on /login, send to /onboarding
  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL("/onboarding", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
