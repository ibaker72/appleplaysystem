import "server-only";
import { getResendClient } from "@/lib/email/client";
import { getResendEnv } from "@/lib/env";

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const client = getResendClient();
  if (!client) {
    console.warn("[email] RESEND_API_KEY not set — skipping email send");
    return;
  }

  const { fromEmail } = getResendEnv();
  const from = fromEmail ?? "Remote Code DE <noreply@remotecode.de>";

  try {
    await client.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });
  } catch (err) {
    console.error("[email] Failed to send email:", err instanceof Error ? err.message : err);
  }
}
