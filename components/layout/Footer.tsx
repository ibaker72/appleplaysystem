export function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 text-sm text-white/60">
      <div className="container-shell flex flex-col justify-between gap-5 md:flex-row">
        <p>© 2026 Remote Code DE. Built for compatible BMW vehicles.</p>
        <div className="flex gap-5">
          <a href="/contact">Contact</a>
          <a href="/faq">FAQ</a>
          <a href="/pricing">Pricing</a>
        </div>
      </div>
    </footer>
  );
}
