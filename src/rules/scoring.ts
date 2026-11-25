import { SCORING_CONFIG, type ScoringConfig } from "@/config/scoring";
import type {
  Initiative,
  Kpi,
  Objective,
  PerformanceStatus,
  Perspective,
  StrategyData,
} from "@/domain/strategy";

/**
 * Pure scoring functions. Every score is a ratio (0–1) or `null` when
 * there is nothing to measure yet. Every score is for one `year` of the
 * strategy. Tuning lives in config/scoring.ts; every function accepts an
 * optional config so it can be tested in isolation.
 */

type Score = number | null;

interface Weighted {
  weight: number;
  score: Score;
}

function clamp(value: number, config: ScoringConfig): number {
  const { min, max } = config.achievement;
  return Math.min(max, Math.max(min, value));
}

/**
 * Weighted average that skips items without a score and re-normalises
 * the remaining weights. If every weight is 0, items count equally.
 */
export function weightedAverage(items: Weighted[]): Score {
  const scored = items.filter(
    (item): item is { weight: number; score: number } => item.score !== null,
  );
  if (scored.length === 0) return null;

  const totalWeight = scored.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight <= 0) {
    return scored.reduce((sum, item) => sum + item.score, 0) / scored.length;
  }
  return (
    scored.reduce((sum, item) => sum + item.score * item.weight, 0) /
    totalWeight
  );
}

// ── KPIs ──────────────────────────────────────────────────────

/** Achievement of a KPI in `year`: that year's actual against that year's target. */
export function kpiAchievement(
  kpi: Kpi,
  year: number,
  config: ScoringConfig = SCORING_CONFIG,
): Score {
  const entry = kpi.yearly[year];
  if (!entry || entry.target === null || entry.actual === null) return null;
  const { target, actual } = entry;

  if (config.kpiMethod === "baseline" && target !== kpi.baseline) {
    return clamp((actual - kpi.baseline) / (target - kpi.baseline), config);
  }

  // Ratio method (also the fallback when target equals baseline).
  if (kpi.direction === "higher") {
    return target === 0 ? null : clamp(actual / target, config);
  }
  if (actual <= 0) return clamp(1, config);
  return clamp(target / actual, config);
}

// ── Initiatives ───────────────────────────────────────────────

/** Achievement entered for `year` (0–1), or null if the initiative doesn't run then / not entered. */
export function initiativeYearAchievement(initiative: Initiative, year: number): Score {
  const entry = initiative.yearly[year];
  if (!entry || entry.weight <= 0 || entry.achievement === null) return null;
  return entry.achievement / 100;
}

export interface InitiativeProgress {
  /** Share of the whole initiative planned up to `year` (0–1). */
  planned: number;
  /** Share of the whole initiative achieved up to `year` (0–1). */
  achieved: number;
  /** achieved ÷ planned, or null when nothing measurable yet. */
  performance: Score;
}

/**
 * Cumulative progress over every year up to and including `year`.
 * Years whose achievement hasn't been entered are left out of both
 * planned and achieved, so a missing entry doesn't count as 0%.
 */
export function initiativeProgress(
  initiative: Initiative,
  year: number,
  config: ScoringConfig = SCORING_CONFIG,
): InitiativeProgress {
  let planned = 0;
  let achieved = 0;
  for (const [key, entry] of Object.entries(initiative.yearly)) {
    if (Number(key) > year || entry.weight <= 0 || entry.achievement === null) continue;
    planned += entry.weight;
    achieved += (entry.weight * entry.achievement) / 100;
  }
  const total = config.weightTotal;
  return {
    planned: planned / total,
    achieved: achieved / total,
    performance: planned > 0 ? clamp(achieved / planned, config) : null,
  };
}

/** The initiative figure that rolls up, per `config.initiativeScore`. */
export function initiativeScore(
  initiative: Initiative,
  year: number,
  config: ScoringConfig = SCORING_CONFIG,
): Score {
  return config.initiativeScore === "annual"
    ? initiativeYearAchievement(initiative, year)
    : initiativeProgress(initiative, year, config).performance;
}

// ── Roll-ups ──────────────────────────────────────────────────

export interface ObjectiveScore {
  kpis: Score;
  initiatives: Score;
  total: Score;
}

export function objectiveScore(
  objective: Objective,
  data: StrategyData,
  year: number,
  config: ScoringConfig = SCORING_CONFIG,
): ObjectiveScore {
  const kpis = weightedAverage(
    data.kpis
      .filter((kpi) => kpi.objectiveId === objective.id)
      .map((kpi) => ({ weight: kpi.weight, score: kpiAchievement(kpi, year, config) })),
  );
  const initiatives = weightedAverage(
    data.initiatives
      .filter((item) => item.objectiveId === objective.id)
      .map((item) => ({
        weight: item.weight,
        score: initiativeScore(item, year, config),
      })),
  );
  const total = weightedAverage([
    { weight: config.objectiveMix.kpis, score: kpis },
    { weight: config.objectiveMix.initiatives, score: initiatives },
  ]);
  return { kpis, initiatives, total };
}

export function perspectiveScore(
  perspective: Perspective,
  data: StrategyData,
  year: number,
  config: ScoringConfig = SCORING_CONFIG,
): Score {
  return weightedAverage(
    data.objectives
      .filter((objective) => objective.perspectiveId === perspective.id)
      .map((objective) => ({
        weight: objective.weight,
        score: objectiveScore(objective, data, year, config).total,
      })),
  );
}

export function overallScore(
  data: StrategyData,
  year: number,
  config: ScoringConfig = SCORING_CONFIG,
): Score {
  return weightedAverage(
    data.perspectives.map((perspective) => ({
      weight: perspective.weight,
      score: perspectiveScore(perspective, data, year, config),
    })),
  );
}

// ── Presentation helpers ─────────────────────────────────────

export function statusFor(
  score: Score,
  config: ScoringConfig = SCORING_CONFIG,
): PerformanceStatus {
  if (score === null) return "noData";
  if (score >= config.thresholds.onTrack) return "onTrack";
  if (score >= config.thresholds.atRisk) return "atRisk";
  return "offTrack";
}

/** 0.734 → 73 */
export function toPercent(score: Score): number | null {
  return score === null ? null : Math.round(score * 100);
}
