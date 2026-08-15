import { auth } from "@/auth";

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isAuthRoute = pathname.startsWith("/login");
  const isPublicAsset = pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.includes(".");

  // Protected routes that strictly require an authenticated user
  const isProtectedRoute =
    pathname.startsWith("/watchlist") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/admin");

  // 1. If unauthenticated user tries to access protected areas, redirect to /login
  if (!isLoggedIn && isProtectedRoute && !isPublicAsset) {
    let from = pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }
    return Response.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, req.nextUrl));
  }

  // 2. If authenticated user lands on /login, send them to /discover or /onboarding
  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL("/discover", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
