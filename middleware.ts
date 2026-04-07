import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const protectedPrefixes = ["/dashboard", "/booking", "/setup-instructions", "/technician"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  const isAdmin = pathname.startsWith("/admin");
  const isTechnician = pathname.startsWith("/technician");

  // Create a response that @supabase/ssr can write refreshed cookies to
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  // Refresh the session — this call handles token refresh automatically
  const { data: { user } } = await supabase.auth.getUser();

  if (!isProtected && !isAdmin && !isTechnician) {
    return supabaseResponse;
  }

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes: additional guard via env-var allow-list
  if (isAdmin) {
    const adminIds = (process.env.ADMIN_USER_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    if (adminIds.length > 0 && !adminIds.includes(user.id)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Technician routes: guard via env-var allow-list (admins also have access)
  if (isTechnician) {
    const techIds = (process.env.TECHNICIAN_USER_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    const adminIds = (process.env.ADMIN_USER_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    const allowed = techIds.includes(user.id) || adminIds.includes(user.id);
    if (!allowed) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/booking/:path*", "/setup-instructions/:path*", "/technician/:path*"],
};
