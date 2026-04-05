"use client";

import Link from "next/link";

export default function ResultsError({ reset }: { reset: () => void }) {
  return (
    <div className="container-shell py-20">
      <div className="surface mx-auto max-w-lg rounded-premium p-8 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">Error</p>
        <h2 className="mt-2 text-xl font-semibold">Unable to load results</h2>
        <p className="mt-3 text-sm text-white/60">
          We could not complete the compatibility check. This may be a temporary issue.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
          >
            Try again
          </button>
          <Link
            href="/check-compatibility"
            className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            New check
          </Link>
        </div>
      </div>
    </div>
  );
}
