import type { CSSProperties } from "react";

/**
 * Shared enter-animation helpers (tw-animate-css classes). All of them are
 * switched off under `prefers-reduced-motion` by the rule in globals.css.
 */

/** Delay between items that appear one after another. */
export const STAGGER_MS = 60;
/** Stop growing the delay after this many items so long lists don't drag. */
const MAX_STAGGER_STEPS = 10;

export function staggerDelay(index: number, stepMs = STAGGER_MS): CSSProperties {
  return { animationDelay: `${Math.min(index, MAX_STAGGER_STEPS) * stepMs}ms` };
}

/** Cards / sections: fade and rise. */
export const ENTER_UP =
  "animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-500 ease-out";

/** Table rows: quick fade. Use with staggerDelay(index, 30). */
export const ENTER_ROW = "animate-in fade-in fill-mode-both duration-300";
