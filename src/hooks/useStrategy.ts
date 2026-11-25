"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";
import { useShallow } from "zustand/react/shallow";
import type { Locale, LocalizedText } from "@/domain/locale";
import type { StrategyData } from "@/domain/strategy";
import { localize } from "@/rules/locale";
import {
  objectiveScore,
  overallScore,
  perspectiveScore,
  type ObjectiveScore,
} from "@/rules/scoring";
import { resolveYear, strategyYears } from "@/rules/years";
import { selectData, useStrategyStore } from "@/store/strategyStore";
import { useUiStore } from "@/store/uiStore";

/** The collections, re-rendering only when one of them changes. */
export function useStrategyData(): StrategyData {
  return useStrategyStore(useShallow(selectData));
}

/** The year chosen in the year filter, always inside the strategy's range. */
export function useSelectedYear(): number {
  const strategy = useStrategyStore((s) => s.strategy);
  const requested = useUiStore((s) => s.selectedYear);
  return resolveYear(strategy, requested);
}

/** Every year of the strategy, e.g. [2024, 2025, 2026]. */
export function useStrategyYears(): number[] {
  const strategy = useStrategyStore((s) => s.strategy);
  return useMemo(() => strategyYears(strategy), [strategy]);
}

export interface StrategyScores {
  year: number;
  overall: number | null;
  perspectives: Record<string, number | null>;
  objectives: Record<string, ObjectiveScore>;
}

/** All roll-up scores for the selected year, recomputed only when data or year change. */
export function useStrategyScores(): StrategyScores {
  const data = useStrategyData();
  const year = useSelectedYear();
  return useMemo(() => {
    const objectives: Record<string, ObjectiveScore> = {};
    for (const objective of data.objectives) {
      objectives[objective.id] = objectiveScore(objective, data, year);
    }
    const perspectives: Record<string, number | null> = {};
    for (const perspective of data.perspectives) {
      perspectives[perspective.id] = perspectiveScore(perspective, data, year);
    }
    return { year, overall: overallScore(data, year), perspectives, objectives };
  }, [data, year]);
}

/** `l(entity.name)` → text in the current locale. */
export function useLocalize(): (text: LocalizedText) => string {
  const locale = useLocale() as Locale;
  return (text) => localize(text, locale);
}
