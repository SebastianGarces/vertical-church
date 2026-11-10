"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { XIcon } from "lucide-react";
import { CHRISTMAS_PATH } from "@/lib/christmas";

/**
 * Sitewide Christmas banner.
 *
 * Dismissal lives only in this provider's React state (no cookies, localStorage or
 * sessionStorage). The provider is mounted in the root layout, so it survives client
 * navigation; a full reload starts a fresh React tree and the banner shows again.
 *
 * Height: while the banner is in the DOM, globals.css sets --site-banner-h on :root
 * (via :has([data-site-banner])). The fixed header, body offset and hero fit read it,
 * so they all fall back to 0 the moment the banner unmounts.
 *
 * Turn it off with CHRISTMAS_BANNER_ENABLED in lib/christmas.ts.
 */

type ChristmasBannerState = { dismissed: boolean; dismiss: () => void };

const ChristmasBannerContext = createContext<ChristmasBannerState | null>(null);

export function ChristmasBannerProvider({ children }: { children: React.ReactNode }) {
  const [dismissed, setDismissed] = useState(false);
  const dismiss = useCallback(() => setDismissed(true), []);
  const value = useMemo(() => ({ dismissed, dismiss }), [dismissed, dismiss]);

  return (
    <ChristmasBannerContext.Provider value={value}>
      <ChristmasBanner />
      {children}
    </ChristmasBannerContext.Provider>
  );
}

// Top-level route segments where the banner never shows. The segment comes from the
// route tree, not the browser URL, so the admin host (which proxy.ts rewrites to
// /admin/*) is matched here even though its URLs have no /admin prefix.
const HIDDEN_SEGMENTS = new Set(["admin", CHRISTMAS_PATH.slice(1)]);

function ChristmasBanner() {
  const state = useContext(ChristmasBannerContext);
  const segment = useSelectedLayoutSegment();

  if (!state || state.dismissed) return null;
  if (segment && HIDDEN_SEGMENTS.has(segment)) return null;

  return (
    <div
      data-site-banner
      role="region"
      aria-label="Christmas announcement"
      className="fixed inset-x-0 top-0 z-[60] flex h-[var(--site-banner-h)] items-center border-b-2 border-[#F83236] bg-[#2D412F] font-['Times_New_Roman',Times,serif] text-[#EAECEA]"
    >
      <div className="flex w-full min-w-0 items-center justify-center gap-3 pl-4 pr-12 sm:gap-5 md:pr-14">
        <p className="min-w-0 truncate text-[0.9rem] uppercase leading-none tracking-[0.01em] md:text-base lg:text-lg">
          <span className="hidden lg:inline">Celebrate Christmas with us at Vertical Church</span>
          <span className="hidden sm:inline lg:hidden">Celebrate Christmas with us</span>
          <span className="hidden sm:inline" aria-hidden="true">
            {"  |  "}
          </span>
          <span>Christmas Eve at 4PM</span>
        </p>
        <Link
          href={CHRISTMAS_PATH}
          className="shrink-0 border border-[#EAECEA] px-2.5 py-1.5 font-button text-[0.6875rem] uppercase leading-none tracking-[0.2em] whitespace-pre transition-colors hover:bg-[#EAECEA] hover:text-[#2D412F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EAECEA] md:px-3 md:text-xs"
        >
          Learn more<span className="sr-only"> about Christmas at Vertical Church</span>
        </Link>
      </div>
      <button
        type="button"
        onClick={state.dismiss}
        aria-label="Close Christmas announcement"
        className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center text-[#EAECEA] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#EAECEA] md:right-3"
      >
        <XIcon className="size-5" aria-hidden="true" />
      </button>
    </div>
  );
}
