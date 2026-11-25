import { SCORING_CONFIG } from "@/config/scoring";

/** Sum of sibling weights, optionally leaving one item out (the one being edited). */
export function sumWeights(
  items: { id: string; weight: number }[],
  excludeId?: string,
): number {
  return items
    .filter((item) => item.id !== excludeId)
    .reduce((sum, item) => sum + item.weight, 0);
}

/** Weight still available to a new / edited sibling. */
export function remainingWeight(
  items: { id: string; weight: number }[],
  excludeId?: string,
): number {
  return Math.max(0, SCORING_CONFIG.weightTotal - sumWeights(items, excludeId));
}

export function isBalanced(items: { weight: number }[]): boolean {
  if (items.length === 0) return true;
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  return Math.abs(total - SCORING_CONFIG.weightTotal) < 0.01;
}
