import { Suspense } from "react";
import { ToastTrigger } from "@/components/ui/toast-trigger";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <ToastTrigger />
      </Suspense>
      {children}
    </>
  );
}
