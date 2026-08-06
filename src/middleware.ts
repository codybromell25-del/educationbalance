import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Route guard for the admin area.
 *
 * ENQUIRIES-role users (currently just Aoife) are only allowed to
 * see /admin/applications and its API. Any attempt to hit another
 * /admin/* or /api/admin/* route is redirected to
 * /admin/applications — no clicks needed on our side to keep them
 * out of the rest of the admin panel.
 *
 * Uses next-auth/jwt's getToken directly rather than the auth()
 * wrapper so this file stays edge-runtime-safe and doesn't pull in
 * the bcrypt-heavy credentials provider.
 */
export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    // NextAuth v5's default cookie name in production is
    // "__Secure-authjs.session-token"; dev is "authjs.session-token".
    // getToken handles both automatically.
  });

  const role = token?.role as string | undefined;

  if (role === "ENQUIRIES") {
    const allowed =
      path === "/admin/applications" ||
      path.startsWith("/admin/applications/") ||
      path === "/api/admin/applications" ||
      path.startsWith("/api/admin/applications/");
    if (!allowed) {
      return NextResponse.redirect(new URL("/admin/applications", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
