import { cookies } from "next/headers";

const ACCESS_COOKIE = "sb_access_token";
const REFRESH_COOKIE = "sb_refresh_token";

export async function getAccessTokenFromCookies() {
  return (await cookies()).get(ACCESS_COOKIE)?.value ?? null;
}

export async function getRefreshTokenFromCookies() {
  return (await cookies()).get(REFRESH_COOKIE)?.value ?? null;
}

export async function setAuthCookies(session: {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
}) {
  const cookieStore = await cookies();
  const maxAge = session.expires_at
    ? Math.max(0, session.expires_at - Math.floor(Date.now() / 1000))
    : 60 * 60;

  cookieStore.set(ACCESS_COOKIE, session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  cookieStore.set(REFRESH_COOKIE, session.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
}
