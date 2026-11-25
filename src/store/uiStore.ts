"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const FONT_SCALES = [0.875, 1, 1.125, 1.25] as const;
const DEFAULT_SCALE_INDEX = 1;

interface UiState {
  selectedPerspectiveId: string | null;
  selectedObjectiveId: string | null;
  fontScaleIndex: number;
  /** Year picked in the year filter; resolved against the strategy by useSelectedYear(). */
  selectedYear: number | null;

  selectYear: (year: number) => void;
  selectPerspective: (id: string | null) => void;
  selectObjective: (objectiveId: string | null, perspectiveId?: string) => void;
  increaseFont: () => void;
  decreaseFont: () => void;
  resetFont: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      selectedPerspectiveId: null,
      selectedObjectiveId: null,
      fontScaleIndex: DEFAULT_SCALE_INDEX,
      selectedYear: null,

      selectYear: (year) => set({ selectedYear: year }),
      selectPerspective: (id) =>
        set({ selectedPerspectiveId: id, selectedObjectiveId: null }),
      selectObjective: (objectiveId, perspectiveId) =>
        set((s) => ({
          selectedObjectiveId: objectiveId,
          selectedPerspectiveId: perspectiveId ?? s.selectedPerspectiveId,
        })),
      increaseFont: () =>
        set((s) => ({
          fontScaleIndex: Math.min(
            FONT_SCALES.length - 1,
            s.fontScaleIndex + 1,
          ),
        })),
      decreaseFont: () =>
        set((s) => ({ fontScaleIndex: Math.max(0, s.fontScaleIndex - 1) })),
      resetFont: () => set({ fontScaleIndex: DEFAULT_SCALE_INDEX }),
    }),
    {
      name: "ssc-strategy-ui",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
