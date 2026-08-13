import { auth } from "@/auth";

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthRoute = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/onboarding");
  const isProtectedRoute = 
    req.nextUrl.pathname.startsWith("/profile") || 
    req.nextUrl.pathname.startsWith("/watchlist") || 
    req.nextUrl.pathname.startsWith("/admin");

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/", req.nextUrl));
    }
    return;
  }

  if (isProtectedRoute && !isLoggedIn) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }
    return Response.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, req.nextUrl));
  }
});

// Optionally, don't invoke Proxy on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
