"use client";

import { useEffect } from "react";
import { useStrategyStore } from "@/store/strategyStore";
import { FONT_SCALES, useUiStore } from "@/store/uiStore";

/**
 * Both stores use `skipHydration`, so the static HTML and the first client
 * render match. This reads localStorage once after mount, then keeps the
 * A- / A / A+ font scale applied to <html>.
 */
export default function StoreHydrator() {
  const fontScaleIndex = useUiStore((s) => s.fontScaleIndex);

  useEffect(() => {
    void useStrategyStore.persist.rehydrate();
    void useUiStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${FONT_SCALES[fontScaleIndex] * 100}%`;
  }, [fontScaleIndex]);

  return null;
}
