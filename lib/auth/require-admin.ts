import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/get-user";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

/**
 * Admin allow-list stored in customer_profiles.role (or, until that column
 * exists, fall back to a hard-coded env-var list of admin user IDs).
 *
 * This keeps admin routes inaccessible to regular authenticated users while
 * avoiding a premature full RBAC system.
 */
const ADMIN_IDS_FROM_ENV = (process.env.ADMIN_USER_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);

async function isAdmin(userId: string): Promise<boolean> {
  // Fast path: env-var allow-list
  if (ADMIN_IDS_FROM_ENV.length > 0) {
    return ADMIN_IDS_FROM_ENV.includes(userId);
  }

  // Fallback: check for a `role` column on customer_profiles (future-proof).
  // If the column doesn't exist yet, the query will return null and we deny.
  try {
    const supabase = createAdminSupabaseClient();
    const { data } = await supabase
      .from("customer_profiles")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    // Until a real role column exists, only env-listed users are admins.
    // If ADMIN_USER_IDS is empty and no role column, deny everyone.
    return data !== null && ADMIN_IDS_FROM_ENV.includes(userId);
  } catch {
    return false;
  }
}

/**
 * Require the current user to be an admin. Redirects to /dashboard if not.
 */
export async function requireAdmin() {
  const user = await getUser();
  if (!user) {
    redirect("/login?next=/admin");
  }

  const admin = await isAdmin(user.id);
  if (!admin) {
    redirect("/dashboard");
  }

  return user;
}
