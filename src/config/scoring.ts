/**
 * ─────────────────────────────────────────────────────────────
 *  SCORING CONFIGURATION — the single place to tune the maths.
 * ─────────────────────────────────────────────────────────────
 * All values are plain numbers / flags so business rules can be
 * changed here without touching any formula in rules/scoring.ts.
 */
export const SCORING_CONFIG = {
  /**
   * How an objective's score is split between its KPIs and its
   * initiatives. Must add up to 1. If an objective has only one of
   * the two (or one has no data yet), the other counts 100%.
   */
  objectiveMix: {
    kpis: 0.7,
    initiatives: 0.3,
  },

  /**
   * How a KPI's achievement for a year is measured:
   *  - "baseline": progress from baseline toward that year's target
   *                (actual − baseline) / (target − baseline)
   *  - "ratio":    actual / target (or target / actual when lower is better)
   */
  kpiMethod: "baseline" as "baseline" | "ratio",

  /**
   * Which initiative figure rolls up into objectives:
   *  - "cumulative": achieved so far ÷ planned so far, over every year up to
   *                  the selected one. Example (30/30/40 split): 2024 100%,
   *                  2025 80% → (30×1 + 30×0.8) ÷ (30 + 30) = 54 ÷ 60 = 90%.
   *  - "annual":     the selected year's achievement only.
   */
  initiativeScore: "cumulative" as "cumulative" | "annual",

  /** Achievement is clamped to this range (1 = 100%). Raise max to reward over-achievement. */
  achievement: { min: 0, max: 1 },

  /** Score bands (ratios, 0–1). Anything below `atRisk` is off track. */
  thresholds: {
    onTrack: 0.8,
    atRisk: 0.5,
  },

  /** Sibling weights (and an initiative's yearly weights) are expected to sum to this. */
  weightTotal: 100,

  /** Longest strategy allowed, in years. */
  maxStrategyYears: 10,
};

export type ScoringConfig = typeof SCORING_CONFIG;
