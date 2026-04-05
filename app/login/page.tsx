import { PremiumSection } from "@/components/marketing/PremiumSection";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <PremiumSection eyebrow="Account" title="Login">
      <form className="surface mx-auto max-w-md space-y-3 rounded-premium p-6">
        <input className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2" placeholder="Email" />
        <input className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2" placeholder="Password" type="password" />
        <Button className="w-full">Sign in</Button>
      </form>
    </PremiumSection>
  );
}
