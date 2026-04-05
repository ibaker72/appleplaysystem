import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedPrefixes = ["/dashboard", "/booking", "/setup-instructions"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  const isAdmin = pathname.startsWith("/admin");

  if (!isProtected && !isAdmin) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("sb_access_token")?.value;

  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Decode the JWT to check expiration (without verification — actual
  // verification happens server-side via getUser). This prevents serving
  // protected pages with clearly-expired tokens.
  try {
    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    const exp = payload.exp as number | undefined;
    if (exp && exp < Math.floor(Date.now() / 1000)) {
      // Token expired — the server-side getUser will attempt refresh.
      // But if there's no refresh token, redirect to login.
      const refreshToken = request.cookies.get("sb_refresh_token")?.value;
      if (!refreshToken) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  } catch {
    // Malformed token — let server-side auth handle it
  }

  // Admin routes: additional guard via env-var allow-list in middleware
  // (full check also runs server-side via requireAdmin).
  if (isAdmin) {
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      const userId = payload.sub as string | undefined;
      const adminIds = (process.env.ADMIN_USER_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
      if (adminIds.length > 0 && userId && !adminIds.includes(userId)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      // Let server-side handle
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/booking/:path*", "/setup-instructions/:path*"],
};
