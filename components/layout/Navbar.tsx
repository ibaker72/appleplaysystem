import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth/get-user";

const links = [
  ["How it works", "/how-it-works"],
  ["Supported Vehicles", "/supported-vehicles"],
  ["Features", "/features"],
  ["Pricing", "/pricing"],
  ["FAQ", "/faq"],
];

export async function Navbar() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="container-shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="shrink-0 text-sm font-semibold tracking-wide">
          REMOTE CODE // DE
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-white/75 lg:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-white">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 gap-2">
          {user ? (
            <Button href="/dashboard" variant="ghost">
              Dashboard
            </Button>
          ) : (
            <Button href="/login" variant="ghost" className="hidden sm:inline-flex">
              Login
            </Button>
          )}
          <Button href="/check-compatibility">Check Compatibility</Button>
        </div>
      </div>
    </header>
  );
}
