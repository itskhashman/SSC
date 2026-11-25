import type { Strategy } from "@/domain/strategy";

/** [2024, 2025, 2026] for a 2024–2026 strategy; [] without one. */
export function strategyYears(strategy: Strategy | null): number[] {
  if (!strategy) return [];
  const years: number[] = [];
  for (let y = strategy.startYear; y <= strategy.endYear; y++) years.push(y);
  return years;
}

/**
 * The year to show: the requested one if it is inside the strategy,
 * otherwise the current year clamped into the strategy's range.
 */
export function resolveYear(
  strategy: Strategy | null,
  requested: number | null,
  today: Date = new Date(),
): number {
  const fallback = today.getFullYear();
  if (!strategy) return requested ?? fallback;
  const { startYear, endYear } = strategy;
  if (requested !== null && requested >= startYear && requested <= endYear) {
    return requested;
  }
  return Math.min(endYear, Math.max(startYear, fallback));
}

/** Keep only the keys of `yearly` that fall inside the strategy. */
export function pruneYears<T>(
  yearly: Record<string, T>,
  strategy: Strategy,
): Record<string, T> {
  return Object.fromEntries(
    Object.entries(yearly).filter(([year]) => {
      const y = Number(year);
      return y >= strategy.startYear && y <= strategy.endYear;
    }),
  );
}
