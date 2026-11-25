"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import type { Objective } from "@/domain/strategy";
import { useLocalize, useStrategyData, useStrategyScores } from "@/hooks/useStrategy";
import { statusFor } from "@/rules/scoring";
import { cn } from "@/lib/utils";
import { ENTER_ROW, staggerDelay } from "@/lib/motion";
import { useStrategyStore } from "@/store/strategyStore";
import { useUiStore } from "@/store/uiStore";
import GoldCard from "@/components/common/GoldCard";
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
import ObjectiveFormDialog from "./forms/ObjectiveFormDialog";
import RowActions from "./RowActions";

/** All objectives of the strategy. Clicking a row opens its initiatives below. */
export default function ObjectivesPanel({ activeId }: { activeId?: string }) {
  const t = useTranslations();
  const l = useLocalize();
  const format = useFormatter();
  const { objectives, initiatives } = useStrategyData();
  const scores = useStrategyScores();
  const deleteObjective = useStrategyStore((s) => s.deleteObjective);
  const selectObjective = useUiStore((s) => s.selectObjective);

  const [dialog, setDialog] = useState<{ open: boolean; item?: Objective }>({ open: false });

  return (
    <GoldCard bodyClassName="p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-semibold">{t("strategy.objectives")}</h2>
          <WeightSummary items={objectives} />
        </div>
        <Button size="sm" onClick={() => setDialog({ open: true })}>
          <Plus /> {t("strategy.addObjective")}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="ps-5">{t("columns.objective")}</TableHead>
            <TableHead>{t("common.owner")}</TableHead>
            <TableHead>{t("common.weight")}</TableHead>
            <TableHead>{t("columns.initiatives")}</TableHead>
            <TableHead>{t("columns.score")}</TableHead>
            <TableHead>{t("common.status")}</TableHead>
            <TableHead className="pe-5 text-end">{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {objectives.map((objective, index) => {
            const score = scores.objectives[objective.id] ?? null;
            const active = objective.id === activeId;
            return (
              <TableRow
                key={objective.id}
                data-state={active ? "selected" : undefined}
                className={cn("cursor-pointer", ENTER_ROW, active && "bg-accent!")}
                style={staggerDelay(index, 30)}
                onClick={() => selectObjective(objective.id)}
              >
                <TableCell className="max-w-72 truncate ps-5 font-medium">{l(objective.name)}</TableCell>
                <TableCell className="max-w-48 truncate text-muted-foreground">{objective.owner || "—"}</TableCell>
                <TableCell className="tabular-nums">
                  {format.number(objective.weight / 100, { style: "percent" })}
                </TableCell>
                <TableCell className="tabular-nums">
                  {format.number(initiatives.filter((i) => i.objectiveId === objective.id).length)}
                </TableCell>
                <TableCell><ScoreBar score={score} /></TableCell>
                <TableCell><StatusBadge status={statusFor(score)} /></TableCell>
                <TableCell className="pe-5">
                  <RowActions
                    onEdit={() => setDialog({ open: true, item: objective })}
                    onDelete={() => deleteObjective(objective.id)}
                    deleteDescription={t("strategy.deleteObjectiveWarning")}
                  />
                </TableCell>
              </TableRow>
            );
          })}
          {objectives.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                {t("strategy.noObjectives")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ObjectiveFormDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
        objective={dialog.item}
      />
    </GoldCard>
  );
}
