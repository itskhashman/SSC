import type { LocalizedText } from "@/domain/locale";

/**
 * Balanced Scorecard hierarchy:
 *   Strategy (one, spanning several years)
 *     → Perspective → Objective → (KPIs + Initiatives)
 * Every level below the strategy carries a `weight` (0–100) relative to its
 * siblings. KPIs and initiatives also carry values per year of the strategy.
 */

export interface Strategy {
  name: LocalizedText;
  startYear: number;
  endYear: number;
}

export interface Perspective {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  weight: number;
  /** Lucide icon key from PERSPECTIVE_ICONS. */
  icon: PerspectiveIcon;
}

export type PerspectiveIcon =
  | "users"
  | "wallet"
  | "workflow"
  | "graduation"
  | "shield"
  | "target";

export interface Objective {
  id: string;
  perspectiveId: string;
  name: LocalizedText;
  description: LocalizedText;
  owner: string;
  weight: number;
}

export type KpiDirection = "higher" | "lower";

export type KpiFrequency = "monthly" | "quarterly" | "yearly";

/** One year of a KPI. `null` = not set / not measured yet. */
export interface KpiYear {
  target: number | null;
  actual: number | null;
}

export interface Kpi {
  id: string;
  objectiveId: string;
  name: LocalizedText;
  unit: string;
  frequency: KpiFrequency;
  direction: KpiDirection;
  baseline: number;
  weight: number;
  /** Keyed by year ("2025"). */
  yearly: Record<string, KpiYear>;
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
  perspectives: Perspective[];
  objectives: Objective[];
  kpis: Kpi[];
  initiatives: Initiative[];
}

/** Score band derived from an achievement ratio (see config/scoring.ts). */
export type PerformanceStatus = "onTrack" | "atRisk" | "offTrack" | "noData";
