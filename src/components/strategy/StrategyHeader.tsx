"use client";

import { useState } from "react";
import { CalendarRange, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocalize, useStrategyScores } from "@/hooks/useStrategy";
import { useStrategyStore } from "@/store/strategyStore";
import { statusFor } from "@/rules/scoring";
import GoldCard from "@/components/common/GoldCard";
import ScoreBar from "@/components/common/ScoreBar";
import StatusBadge from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import StrategyFormDialog from "./forms/StrategyFormDialog";

/** Strategy name, its years and the overall score for the selected year. */
export default function StrategyHeader() {
  const t = useTranslations();
  const l = useLocalize();
  const strategy = useStrategyStore((s) => s.strategy);
  const { overall, year } = useStrategyScores();
  const [open, setOpen] = useState(false);

  if (!strategy) return null;

  return (
    <GoldCard bodyClassName="flex flex-wrap items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{t("setup.strategy")}</p>
        <h2 className="text-lg font-semibold">{l(strategy.name)}</h2>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarRange className="size-4 text-gold" />
          {strategy.startYear} – {strategy.endYear}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="min-w-48">
          <p className="mb-1 text-xs text-muted-foreground">
            {t("setup.overallFor", { year })}
          </p>
          <ScoreBar score={overall} />
        </div>
        <StatusBadge status={statusFor(overall)} />
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Pencil /> {t("setup.editTitle")}
        </Button>
      </div>
      <StrategyFormDialog open={open} onOpenChange={setOpen} />
    </GoldCard>
  );
}
