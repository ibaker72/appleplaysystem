"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function ToastTrigger() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    const created = searchParams.get("created");
    const saved = searchParams.get("saved");
    const updated = searchParams.get("updated");

    let fired = false;

    if (checkout === "success") {
      toast.success("Payment confirmed — your session is being prepared");
      fired = true;
    } else if (checkout === "cancelled") {
      toast.warning("Checkout cancelled — you can pay anytime");
      fired = true;
    }

    if (created) {
      toast.success("Order created — complete checkout to begin");
      fired = true;
    }

    if (saved === "1") {
      toast.success("Vehicle saved to your dashboard");
      fired = true;
    }

    if (updated === "1") {
      toast.success("Profile updated");
      fired = true;
    }

    if (fired) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("checkout");
      params.delete("created");
      params.delete("saved");
      params.delete("updated");
      const remaining = params.toString();
      const cleanPath = window.location.pathname + (remaining ? `?${remaining}` : "");
      router.replace(cleanPath, { scroll: false });
    }
  }, [searchParams, router]);

  return null;
}
