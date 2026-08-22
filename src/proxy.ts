import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Next 16 route proxy (was called middleware.ts in older Next).
 *
 * Two concerns:
 *
 * 1. Auth on gated route groups
 *    - /dashboard/**, /course/** — must be logged in
 *    - /admin/**, /api/admin/** — must be ADMIN or ENQUIRIES
 *    - /login — bounce logged-in users to their landing
 *
 * 2. ENQUIRIES role scope
 *    - Aoife (and any other ENQUIRIES account) can only reach
 *      /admin/applications and its API. Any other /admin or
 *      /api/admin path redirects back to applications.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const isAdmin = role === "ADMIN";
  const isEnquiries = role === "ENQUIRIES";

  // Protect dashboard + course routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/course")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Protect admin routes (both pages and API)
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (!isAdmin && !isEnquiries) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    // ENQUIRIES-scope guard — only the applications page + API is allowed.
    if (isEnquiries) {
      const allowed =
        pathname === "/admin/applications" ||
        pathname.startsWith("/admin/applications/") ||
        pathname === "/api/admin/applications" ||
        pathname.startsWith("/api/admin/applications/");
      if (!allowed) {
        return NextResponse.redirect(
          new URL("/admin/applications", req.url),
        );
      }
    }
  }

  // Redirect logged-in users away from /login to their landing area
  if (pathname === "/login" && isLoggedIn) {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (isEnquiries) {
      return NextResponse.redirect(new URL("/admin/applications", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/course/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
    "/login",
  ],
};
