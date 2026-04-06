import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Remote German Auto Feature Unlock Platform",
  description: "Premium remote feature unlocks for compatible German vehicles."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#10131a",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
