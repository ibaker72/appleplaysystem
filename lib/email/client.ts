import "server-only";
import { Resend } from "resend";
import { getResendEnv } from "@/lib/env";

let resendClient: Resend | null = null;

export function getResendClient(): Resend | null {
  const { apiKey } = getResendEnv();
  if (!apiKey) return null;

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}
