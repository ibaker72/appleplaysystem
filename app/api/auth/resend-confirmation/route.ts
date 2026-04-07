import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  email: z.string().trim().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "If an account exists, a confirmation email has been sent." },
        { status: 200 }
      );
    }

    const { email } = parsed.data;

    const { success } = await rateLimit({
      key: `resend-confirm:${email}`,
      limit: 3,
      windowMs: 15 * 60 * 1000,
    });

    if (!success) {
      return NextResponse.json(
        { message: "If an account exists, a confirmation email has been sent." },
        { status: 200 }
      );
    }

    const supabase = createAdminSupabaseClient();
    await supabase.auth.resend({ type: "signup", email });

    return NextResponse.json(
      { message: "If an account exists, a confirmation email has been sent." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "If an account exists, a confirmation email has been sent." },
      { status: 200 }
    );
  }
}
