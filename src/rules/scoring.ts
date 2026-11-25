import { SCORING_CONFIG, type ScoringConfig } from "@/config/scoring";
import type {
  Initiative,
  Objective,
  PerformanceStatus,
  StrategyData,
} from "@/domain/strategy";

/**
 * Pure scoring functions. Every score is a ratio (0–1) or `null` when
 * there is nothing to measure yet, and is for one `year` of the strategy.
 * Tuning lives in config/scoring.ts; every function accepts an optional
 * config so it can be tested in isolation.
 *
 *   initiative score → objective score (weighted by initiative weight)
 *                    → overall score   (weighted by objective weight)
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

/** Weighted average of the objective's initiatives. */
export function objectiveScore(
  objective: Objective,
  data: StrategyData,
  year: number,
  config: ScoringConfig = SCORING_CONFIG,
): Score {
  return weightedAverage(
    data.initiatives
      .filter((item) => item.objectiveId === objective.id)
      .map((item) => ({ weight: item.weight, score: initiativeScore(item, year, config) })),
  );
}

/** Weighted average of all objectives. */
export function overallScore(
  data: StrategyData,
  year: number,
  config: ScoringConfig = SCORING_CONFIG,
): Score {
  return weightedAverage(
    data.objectives.map((objective) => ({
      weight: objective.weight,
      score: objectiveScore(objective, data, year, config),
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
