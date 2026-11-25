"use client";

import type { ReactNode } from "react";
import { useStrategyStore } from "@/store/strategyStore";
import { Skeleton } from "@/components/ui/skeleton";
import StrategySetup from "./StrategySetup";

/**
 * Shows skeletons until the saved data has been read from localStorage,
 * then the "create strategy" card until a strategy exists.
 */
export default function HydrationGate({ children }: { children: ReactNode }) {
  const hydrated = useStrategyStore((s) => s.hydrated);
  const hasStrategy = useStrategyStore((s) => s.strategy !== null);

  if (!hydrated) {
    return (
      <div className="space-y-6" aria-busy>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }
  if (!hasStrategy) return <StrategySetup />;
  return <>{children}</>;
}
