"use client";

import { useEffect, useState } from "react";
import { useFormatter } from "next-intl";
import { statusFor } from "@/rules/scoring";
import { cn } from "@/lib/utils";
import { STATUS_STYLES } from "./StatusBadge";

/**
 * Thin progress bar coloured by score band, with the percentage beside it.
 * Grows from 0 when it first appears and slides when the score changes.
 */
export default function ScoreBar({
  score,
  className,
}: {
  /** Ratio 0–1, or null when there is no data. */
  score: number | null;
  className?: string;
}) {
  const format = useFormatter();
  const status = statusFor(score);
  const width = score === null ? 0 : Math.round(score * 100);

  // Render at 0 first, then set the real width so the CSS transition runs.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={cn("flex min-w-28 items-center gap-2", className)}>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-[width,background-color] duration-700 ease-out",
            STATUS_STYLES[status].bar,
          )}
          style={{ width: `${shown ? width : 0}%` }}
        />
      </div>
      <span className="w-10 text-end text-xs font-semibold tabular-nums">
        {score === null ? "—" : format.number(score, { style: "percent" })}
      </span>
    </div>
  );
}
