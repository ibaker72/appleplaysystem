import { Button } from "@/components/ui/button";

const links = [
  ["How it works", "/how-it-works"],
  ["Supported Vehicles", "/supported-vehicles"],
  ["Features", "/features"],
  ["Pricing", "/pricing"],
  ["FAQ", "/faq"]
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="container-shell flex h-16 items-center justify-between">
        <a href="/" className="text-sm font-semibold tracking-wide">REMOTE CODE // DE</a>
        <nav className="hidden items-center gap-6 text-sm text-white/75 md:flex">
          {links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <div className="flex gap-2">
          <Button href="/login" variant="ghost" className="hidden md:inline-flex">Login</Button>
          <Button href="/check-compatibility">Check Compatibility</Button>
        </div>
      </div>
    </header>
  );
}
