import type { Metadata } from "next";
import { PremiumSection } from "@/components/marketing/PremiumSection";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | Remote Code DE",
};

export default function ResetPasswordPage() {
  return (
    <PremiumSection eyebrow="Account" title="Reset your password">
      <ResetPasswordForm />
    </PremiumSection>
  );
}
