"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { SCORING_CONFIG } from "@/config/scoring";
import { isBalanced } from "@/rules/weights";
import { cn } from "@/lib/utils";

/** "Total weight: 90% of 100%" with a warning when siblings don't add up. */
export default function WeightSummary({
  items,
  className,
}: {
  items: { weight: number }[];
  className?: string;
}) {
  const t = useTranslations("common");
  if (items.length === 0) return null;

  const total = items.reduce((sum, item) => sum + item.weight, 0);
  const ok = isBalanced(items);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        ok ? "text-status-on-track" : "text-status-at-risk",
        className,
      )}
    >
      {ok ? <CheckCircle2 className="size-4" /> : <AlertTriangle className="size-4" />}
      {t("weightTotal", { total, expected: SCORING_CONFIG.weightTotal })}
    </span>
  );
}
