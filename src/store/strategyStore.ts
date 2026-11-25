"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  Initiative,
  InitiativeYear,
  Kpi,
  Objective,
  Perspective,
  Strategy,
  StrategyData,
} from "@/domain/strategy";
import { SAMPLE_DATA } from "@/fixture/sampleData";
import { pruneYears } from "@/rules/years";

export type NewPerspective = Omit<Perspective, "id">;
export type NewObjective = Omit<Objective, "id">;
export type NewKpi = Omit<Kpi, "id">;
export type NewInitiative = Omit<Initiative, "id">;

interface StrategyState extends StrategyData {
  /** True once localStorage has been read (see StoreHydrator). */
  hydrated: boolean;

  /** Create or edit the strategy. Yearly values outside a new range are dropped. */
  saveStrategy: (strategy: Strategy) => void;

  addPerspective: (input: NewPerspective) => string;
  updatePerspective: (id: string, input: NewPerspective) => void;
  deletePerspective: (id: string) => void;

  addObjective: (input: NewObjective) => string;
  updateObjective: (id: string, input: NewObjective) => void;
  deleteObjective: (id: string) => void;

  addKpi: (input: NewKpi) => string;
  updateKpi: (id: string, input: NewKpi) => void;
  deleteKpi: (id: string) => void;

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
  perspectives: [],
  objectives: [],
  kpis: [],
  initiatives: [],
};

function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export const useStrategyStore = create<StrategyState>()(
  persist(
    (set) => ({
      ...EMPTY_DATA,
      hydrated: false,

      saveStrategy: (strategy) =>
        set((s) => ({
          strategy,
          kpis: s.kpis.map((k) => ({ ...k, yearly: pruneYears(k.yearly, strategy) })),
          initiatives: s.initiatives.map((i) => ({
            ...i,
            yearly: pruneYears(i.yearly, strategy),
          })),
        })),

      addPerspective: (input) => {
        const id = newId("p");
        set((s) => ({ perspectives: [...s.perspectives, { ...input, id }] }));
        return id;
      },
      updatePerspective: (id, input) =>
        set((s) => ({
          perspectives: s.perspectives.map((p) => (p.id === id ? { ...input, id } : p)),
        })),
      // Deleting a parent removes everything under it.
      deletePerspective: (id) =>
        set((s) => {
          const objectiveIds = new Set(
            s.objectives.filter((o) => o.perspectiveId === id).map((o) => o.id),
          );
          return {
            perspectives: s.perspectives.filter((p) => p.id !== id),
            objectives: s.objectives.filter((o) => !objectiveIds.has(o.id)),
            kpis: s.kpis.filter((k) => !objectiveIds.has(k.objectiveId)),
            initiatives: s.initiatives.filter((i) => !objectiveIds.has(i.objectiveId)),
          };
        }),

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
          kpis: s.kpis.filter((k) => k.objectiveId !== id),
          initiatives: s.initiatives.filter((i) => i.objectiveId !== id),
        })),

      addKpi: (input) => {
        const id = newId("k");
        set((s) => ({ kpis: [...s.kpis, { ...input, id }] }));
        return id;
      },
      updateKpi: (id, input) =>
        set((s) => ({ kpis: s.kpis.map((k) => (k.id === id ? { ...input, id } : k)) })),
      deleteKpi: (id) => set((s) => ({ kpis: s.kpis.filter((k) => k.id !== id) })),

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
      // v2: yearly KPI / initiative values. Older saved data is discarded.
      version: 2,
      migrate: () => ({ ...EMPTY_DATA }),
      storage: createJSONStorage(() => localStorage),
      // Read localStorage after mount so server HTML and first client render match.
      skipHydration: true,
      partialize: ({ strategy, perspectives, objectives, kpis, initiatives }) => ({
        strategy,
        perspectives,
        objectives,
        kpis,
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
    perspectives: state.perspectives,
    objectives: state.objectives,
    kpis: state.kpis,
    initiatives: state.initiatives,
  };
}
