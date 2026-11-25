"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import type { Perspective } from "@/domain/strategy";
import { useLocalize, useStrategyData, useStrategyScores } from "@/hooks/useStrategy";
import { statusFor } from "@/rules/scoring";
import { cn } from "@/lib/utils";
import { useStrategyStore } from "@/store/strategyStore";
import { useUiStore } from "@/store/uiStore";
import GoldCard from "@/components/common/GoldCard";
import ScoreBar from "@/components/common/ScoreBar";
import StatusBadge from "@/components/common/StatusBadge";
import WeightSummary from "@/components/common/WeightSummary";
import { PERSPECTIVE_ICONS } from "@/components/common/perspectiveIcons";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PerspectiveFormDialog from "./forms/PerspectiveFormDialog";
import RowActions from "./RowActions";

export default function PerspectivesPanel({ activeId }: { activeId?: string }) {
  const t = useTranslations();
  const l = useLocalize();
  const format = useFormatter();
  const { perspectives, objectives } = useStrategyData();
  const scores = useStrategyScores();
  const deletePerspective = useStrategyStore((s) => s.deletePerspective);
  const selectPerspective = useUiStore((s) => s.selectPerspective);

  const [dialog, setDialog] = useState<{ open: boolean; item?: Perspective }>({ open: false });

  return (
    <GoldCard bodyClassName="p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-semibold">{t("strategy.perspectives")}</h2>
          <WeightSummary items={perspectives} />
        </div>
        <Button size="sm" onClick={() => setDialog({ open: true })}>
          <Plus /> {t("strategy.addPerspective")}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="ps-5">{t("columns.perspective")}</TableHead>
            <TableHead>{t("common.weight")}</TableHead>
            <TableHead>{t("columns.objectives")}</TableHead>
            <TableHead>{t("columns.score")}</TableHead>
            <TableHead>{t("common.status")}</TableHead>
            <TableHead className="pe-5 text-end">{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {perspectives.map((perspective) => {
            const Icon = PERSPECTIVE_ICONS[perspective.icon];
            const score = scores.perspectives[perspective.id] ?? null;
            const active = perspective.id === activeId;
            return (
              <TableRow
                key={perspective.id}
                data-state={active ? "selected" : undefined}
                className={cn("cursor-pointer", active && "bg-accent!")}
                onClick={() => selectPerspective(perspective.id)}
              >
                <TableCell className="ps-5">
                  <span className="flex items-center gap-2 font-medium">
                    <Icon className="size-4 text-gold" />
                    {l(perspective.name)}
                  </span>
                </TableCell>
                <TableCell className="tabular-nums">
                  {format.number(perspective.weight / 100, { style: "percent" })}
                </TableCell>
                <TableCell className="tabular-nums">
                  {format.number(objectives.filter((o) => o.perspectiveId === perspective.id).length)}
                </TableCell>
                <TableCell><ScoreBar score={score} /></TableCell>
                <TableCell><StatusBadge status={statusFor(score)} /></TableCell>
                <TableCell className="pe-5">
                  <RowActions
                    onEdit={() => setDialog({ open: true, item: perspective })}
                    onDelete={() => deletePerspective(perspective.id)}
                    deleteDescription={t("strategy.deletePerspectiveWarning")}
                  />
                </TableCell>
              </TableRow>
            );
          })}
          {perspectives.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                {t("strategy.noPerspectives")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <PerspectiveFormDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
        perspective={dialog.item}
      />
    </GoldCard>
  );
}
