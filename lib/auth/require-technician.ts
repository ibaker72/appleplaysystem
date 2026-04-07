import "server-only";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/get-user";

const ADMIN_IDS = (process.env.ADMIN_USER_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const TECH_IDS = (process.env.TECHNICIAN_USER_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);

function isTechnician(userId: string): boolean {
  if (TECH_IDS.includes(userId)) return true;
  // Admins can also access the technician portal
  if (ADMIN_IDS.includes(userId)) return true;
  return false;
}

export async function requireTechnician() {
  const user = await getUser();
  if (!user) {
    redirect("/login?next=/technician");
  }

  if (!isTechnician(user.id)) {
    redirect("/dashboard");
  }

  return user;
}
