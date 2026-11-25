"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { Initiative } from "@/domain/strategy";
import { useStrategyStore } from "@/store/strategyStore";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

/**
 * Edit one year's achievement straight from the table. Saves on blur / Enter;
 * empty clears it. Shows "—" when the initiative has no share in that year.
 */
export default function InlineAchievementInput({
  initiative,
  year,
}: {
  initiative: Initiative;
  year: number;
}) {
  const t = useTranslations();
  const updateYear = useStrategyStore((s) => s.updateInitiativeYear);
  const entry = initiative.yearly[year];
  const saved = entry?.achievement ?? null;
  const [draft, setDraft] = useState<string | null>(null);

  if (!entry || entry.weight <= 0) {
    return <span className="text-muted-foreground">—</span>;
  }

  const value = draft ?? (saved === null ? "" : String(saved));
  const parsed = value.trim() === "" ? null : Number(value);
  const invalid = parsed !== null && (Number.isNaN(parsed) || parsed < 0 || parsed > 100);

  const commit = () => {
    if (draft === null) return;
    if (invalid) {
      toast.error(t("validation.max", { max: 100 }));
      setDraft(null);
      return;
    }
    if (parsed !== saved) {
      updateYear(initiative.id, year, { achievement: parsed });
      toast.success(t("common.saved"));
    }
    setDraft(null);
  };

  return (
    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      <Input
        type="number"
        inputMode="decimal"
        min={0}
        max={100}
        aria-label={t("fields.achievementFor", { year })}
        aria-invalid={invalid}
        className={cn("h-8 w-20", invalid && "border-destructive")}
        value={value}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
          if (e.key === "Escape") setDraft(null);
        }}
      />
      <span className="text-xs text-muted-foreground">%</span>
    </div>
  );
}
