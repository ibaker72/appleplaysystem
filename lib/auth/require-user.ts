import "server-only";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/get-user";

export async function requireUser(nextPath?: string) {
  const user = await getUser();
  if (!user) {
    const destination = nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login";
    redirect(destination);
  }
  return user;
}
