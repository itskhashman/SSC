"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import type { Initiative, InitiativeStatus } from "@/domain/strategy";
import { useLocalize, useSelectedYear, useStrategyData } from "@/hooks/useStrategy";
import { initiativeProgress, initiativeScore, statusFor } from "@/rules/scoring";
import { cn } from "@/lib/utils";
import { ENTER_ROW, staggerDelay } from "@/lib/motion";
import { useStrategyStore } from "@/store/strategyStore";
import ScoreBar from "@/components/common/ScoreBar";
import StatusBadge from "@/components/common/StatusBadge";
import WeightSummary from "@/components/common/WeightSummary";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import InitiativeFormDialog from "./forms/InitiativeFormDialog";
import InlineAchievementInput from "./InlineAchievementInput";
import RowActions from "./RowActions";

export const INITIATIVE_STATUS_CLASS: Record<InitiativeStatus, string> = {
  notStarted: "bg-status-no-data/15 text-status-no-data",
  inProgress: "bg-primary/10 text-primary",
  onHold: "bg-status-at-risk/15 text-status-at-risk",
  completed: "bg-status-on-track/15 text-status-on-track",
};

/**
 * Initiatives for the selected year. With `objectiveId` it lists that
 * objective's initiatives (strategy page); without it, every initiative
 * with an objective column (Initiatives page).
 */
export default function InitiativesTable({
  objectiveId,
  rows: rowsProp,
  showWeightSummary = true,
}: {
  objectiveId?: string;
  /** Override the rows (e.g. a filtered list). */
  rows?: Initiative[];
  showWeightSummary?: boolean;
}) {
  const t = useTranslations();
  const l = useLocalize();
  const format = useFormatter();
  const year = useSelectedYear();
  const { initiatives, objectives } = useStrategyData();
  const deleteInitiative = useStrategyStore((s) => s.deleteInitiative);
  const [dialog, setDialog] = useState<{ open: boolean; item?: Initiative }>({ open: false });

  const rows =
    rowsProp ?? (objectiveId ? initiatives.filter((i) => i.objectiveId === objectiveId) : initiatives);
  const showObjective = !objectiveId;
  const pct = (ratio: number) => format.number(ratio, { style: "percent", maximumFractionDigits: 1 });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {showWeightSummary && objectiveId ? <WeightSummary items={rows} /> : <span />}
        <Button size="sm" onClick={() => setDialog({ open: true })}>
          <Plus /> {t("strategy.addInitiative")}
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-4">{t("columns.initiative")}</TableHead>
              {showObjective && <TableHead>{t("columns.objective")}</TableHead>}
              <TableHead>{t("fields.initiativeWeight")}</TableHead>
              <TableHead>{t("columns.yearWeight", { year })}</TableHead>
              <TableHead>{t("columns.yearAchievement", { year })}</TableHead>
              <TableHead>{t("columns.cumulative")}</TableHead>
              <TableHead>{t("columns.score")}</TableHead>
              <TableHead>{t("common.status")}</TableHead>
              <TableHead className="pe-4 text-end">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((initiative, index) => {
              const objective = objectives.find((o) => o.id === initiative.objectiveId);
              const progress = initiativeProgress(initiative, year);
              const score = initiativeScore(initiative, year);
              const yearWeight = initiative.yearly[year]?.weight ?? 0;
              return (
                <TableRow key={initiative.id} className={ENTER_ROW} style={staggerDelay(index, 30)}>
                  <TableCell className="max-w-64 ps-4">
                    <p className="truncate font-medium">{l(initiative.name)}</p>
                    {initiative.owner && (
                      <p className="truncate text-xs text-muted-foreground">{initiative.owner}</p>
                    )}
                  </TableCell>
                  {showObjective && (
                    <TableCell className="max-w-56">
                      <p className="truncate">{objective ? l(objective.name) : "—"}</p>
                      {objective && (
                        <p className="text-xs text-muted-foreground">
                          {t("common.weightValue", { value: format.number(objective.weight) })}
                        </p>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="tabular-nums">
                    {format.number(initiative.weight / 100, { style: "percent" })}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {yearWeight > 0 ? format.number(yearWeight / 100, { style: "percent" }) : "—"}
                  </TableCell>
                  <TableCell>
                    <InlineAchievementInput initiative={initiative} year={year} />
                  </TableCell>
                  <TableCell className="tabular-nums whitespace-nowrap">
                    <span className="font-semibold">{pct(progress.achieved)}</span>
                    <span className="text-xs text-muted-foreground">
                      {" "}
                      / {pct(progress.planned)}
                    </span>
                  </TableCell>
                  <TableCell><ScoreBar score={score} /></TableCell>
                  <TableCell>
                    <div className="flex flex-col items-start gap-1">
                      <StatusBadge status={statusFor(score)} />
                      <span
                        className={cn(
                          "inline-flex h-5 items-center rounded-full px-2 text-[11px] whitespace-nowrap",
                          INITIATIVE_STATUS_CLASS[initiative.status],
                        )}
                      >
                        {t(`initiativeStatus.${initiative.status}`)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="pe-4">
                    <RowActions
                      onEdit={() => setDialog({ open: true, item: initiative })}
                      onDelete={() => deleteInitiative(initiative.id)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={showObjective ? 9 : 8} className="py-8 text-center text-muted-foreground">
                  {t("strategy.noInitiatives")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">{t("strategy.cumulativeHint")}</p>

      <InitiativeFormDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
        objectiveId={objectiveId}
        initiative={dialog.item}
      />
    </div>
  );
}
