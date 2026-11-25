"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  Initiative,
  InitiativeYear,
  Objective,
  Strategy,
  StrategyData,
} from "@/domain/strategy";
import { SAMPLE_DATA } from "@/fixture/sampleData";
import { pruneYears } from "@/rules/years";

export type NewObjective = Omit<Objective, "id">;
export type NewInitiative = Omit<Initiative, "id">;

interface StrategyState extends StrategyData {
  /** True once localStorage has been read (see StoreHydrator). */
  hydrated: boolean;

  /** Create or edit the strategy. Yearly values outside a new range are dropped. */
  saveStrategy: (strategy: Strategy) => void;

  addObjective: (input: NewObjective) => string;
  updateObjective: (id: string, input: NewObjective) => void;
  /** Also deletes the objective's initiatives. */
  deleteObjective: (id: string) => void;

  addInitiative: (input: NewInitiative) => string;
  updateInitiative: (id: string, input: NewInitiative) => void;
  /** Quick edit of one year (used by the inline achievement input). */
  updateInitiativeYear: (id: string, year: number, patch: Partial<InitiativeYear>) => void;
  deleteInitiative: (id: string) => void;

  /** Replace everything with the small sample plan. */
  loadSample: () => void;
  /** Remove everything, including the strategy. */
  clearAll: () => void;
}

const EMPTY_DATA: StrategyData = {
  strategy: null,
  objectives: [],
  initiatives: [],
};

function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

/** Shape saved before v4, when objectives sat under perspectives and KPIs existed. */
interface StoredV3 {
  strategy: Strategy | null;
  perspectives?: { id: string; weight: number }[];
  objectives?: (Objective & { perspectiveId?: string })[];
  initiatives?: Initiative[];
}

/**
 * v3 → v4: drop perspectives and KPIs. Each objective's weight becomes
 * objective weight × perspective weight ÷ 100, so the overall score keeps
 * the same balance between objectives.
 */
function migrateV3(saved: StoredV3): StrategyData {
  const perspectiveWeight = new Map((saved.perspectives ?? []).map((p) => [p.id, p.weight]));
  return {
    strategy: saved.strategy,
    objectives: (saved.objectives ?? []).map(({ perspectiveId, ...objective }) => ({
      ...objective,
      weight:
        Math.round(
          ((objective.weight * (perspectiveWeight.get(perspectiveId ?? "") ?? 100)) / 100) * 100,
        ) / 100,
    })),
    initiatives: saved.initiatives ?? [],
  };
}

export const useStrategyStore = create<StrategyState>()(
  persist(
    (set) => ({
      // First visit (nothing in localStorage) starts with the sample plan.
      ...structuredClone(SAMPLE_DATA),
      hydrated: false,

      saveStrategy: (strategy) =>
        set((s) => ({
          strategy,
          initiatives: s.initiatives.map((i) => ({
            ...i,
            yearly: pruneYears(i.yearly, strategy),
          })),
        })),

      addObjective: (input) => {
        const id = newId("o");
        set((s) => ({ objectives: [...s.objectives, { ...input, id }] }));
        return id;
      },
      updateObjective: (id, input) =>
        set((s) => ({
          objectives: s.objectives.map((o) => (o.id === id ? { ...input, id } : o)),
        })),
      deleteObjective: (id) =>
        set((s) => ({
          objectives: s.objectives.filter((o) => o.id !== id),
          initiatives: s.initiatives.filter((i) => i.objectiveId !== id),
        })),

      addInitiative: (input) => {
        const id = newId("i");
        set((s) => ({ initiatives: [...s.initiatives, { ...input, id }] }));
        return id;
      },
      updateInitiative: (id, input) =>
        set((s) => ({
          initiatives: s.initiatives.map((i) => (i.id === id ? { ...input, id } : i)),
        })),
      updateInitiativeYear: (id, year, patch) =>
        set((s) => ({
          initiatives: s.initiatives.map((i) => {
            if (i.id !== id) return i;
            const current = i.yearly[year] ?? { weight: 0, achievement: null };
            return { ...i, yearly: { ...i.yearly, [year]: { ...current, ...patch } } };
          }),
        })),
      deleteInitiative: (id) =>
        set((s) => ({ initiatives: s.initiatives.filter((i) => i.id !== id) })),

      loadSample: () => set(structuredClone(SAMPLE_DATA)),
      clearAll: () => set({ ...EMPTY_DATA }),
    }),
    {
      name: "ssc-strategy-data",
      // v1 (no yearly values) and empty stores → sample plan.
      // v2/v3 → v4: perspectives and KPIs removed (see migrateV3).
      version: 4,
      migrate: (persisted, version) => {
        const saved = persisted as StoredV3 | undefined;
        if (version >= 2 && saved?.strategy) return migrateV3(saved);
        return structuredClone(SAMPLE_DATA);
      },
      storage: createJSONStorage(() => localStorage),
      // Read localStorage after mount so server HTML and first client render match.
      skipHydration: true,
      partialize: ({ strategy, objectives, initiatives }) => ({
        strategy,
        objectives,
        initiatives,
      }),
      onRehydrateStorage: () => () => {
        useStrategyStore.setState({ hydrated: true });
      },
    },
  ),
);

/** Snapshot of just the data, for the pure scoring functions. */
export function selectData(state: StrategyData): StrategyData {
  return {
    strategy: state.strategy,
    objectives: state.objectives,
    initiatives: state.initiatives,
  };
}
