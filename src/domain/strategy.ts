import type { LocalizedText } from "@/domain/locale";

/**
 * Hierarchy:
 *   Strategy (one, spanning several years)
 *     → Objectives (weights sum to 100 across the strategy)
 *       → Initiatives (weights sum to 100 within their objective,
 *                      plus a weight and an achievement per year)
 */

export interface Strategy {
  name: LocalizedText;
  startYear: number;
  endYear: number;
}

export interface Objective {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  owner: string;
  /** Weight among the strategy's objectives (0–100). */
  weight: number;
}

export type InitiativeStatus =
  | "notStarted"
  | "inProgress"
  | "onHold"
  | "completed";

/** One year of an initiative. */
export interface InitiativeYear {
  /** Share of the whole initiative planned for this year (0–100; all years sum to 100). */
  weight: number;
  /** How much of this year's share was achieved (0–100). `null` = not entered yet. */
  achievement: number | null;
}

export interface Initiative {
  id: string;
  objectiveId: string;
  name: LocalizedText;
  owner: string;
  status: InitiativeStatus;
  /** Weight among the objective's initiatives (0–100). */
  weight: number;
  /** Keyed by year ("2025"). Years with weight 0 are years the initiative doesn't run. */
  yearly: Record<string, InitiativeYear>;
}

export interface StrategyData {
  strategy: Strategy | null;
  objectives: Objective[];
  initiatives: Initiative[];
}

/** Score band derived from an achievement ratio (see config/scoring.ts). */
export type PerformanceStatus = "onTrack" | "atRisk" | "offTrack" | "noData";
