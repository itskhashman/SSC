"use client";

import { useFormatter } from "next-intl";
import { statusFor } from "@/rules/scoring";
import { cn } from "@/lib/utils";
import { STATUS_STYLES } from "./StatusBadge";

/** Thin progress bar coloured by score band, with the percentage beside it. */
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

  return (
    <div className={cn("flex min-w-28 items-center gap-2", className)}>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", STATUS_STYLES[status].bar)}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="w-10 text-end text-xs font-semibold tabular-nums">
        {score === null ? "—" : format.number(score, { style: "percent" })}
      </span>
    </div>
  );
}
