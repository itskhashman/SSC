"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import type { Kpi } from "@/domain/strategy";
import { useLocalize, useSelectedYear, useStrategyData } from "@/hooks/useStrategy";
import { kpiAchievement, statusFor } from "@/rules/scoring";
import { useStrategyStore } from "@/store/strategyStore";
import { ENTER_ROW, staggerDelay } from "@/lib/motion";
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
import KpiFormDialog from "./forms/KpiFormDialog";
import RowActions from "./RowActions";

export default function KpisTable({ objectiveId }: { objectiveId: string }) {
  const t = useTranslations();
  const l = useLocalize();
  const format = useFormatter();
  const year = useSelectedYear();
  const deleteKpi = useStrategyStore((s) => s.deleteKpi);
  const rows = useStrategyData().kpis.filter((k) => k.objectiveId === objectiveId);
  const [dialog, setDialog] = useState<{ open: boolean; item?: Kpi }>({ open: false });

  const value = (n: number | null | undefined, unit: string) =>
    n === null || n === undefined ? "—" : `${format.number(n)} ${unit}`;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <WeightSummary items={rows} />
        <Button size="sm" onClick={() => setDialog({ open: true })}>
          <Plus /> {t("strategy.addKpi")}
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-4">{t("columns.kpi")}</TableHead>
              <TableHead>{t("fields.frequency")}</TableHead>
              <TableHead>{t("columns.baseline")}</TableHead>
              <TableHead>{t("columns.targetFor", { year })}</TableHead>
              <TableHead>{t("columns.actualFor", { year })}</TableHead>
              <TableHead>{t("common.weight")}</TableHead>
              <TableHead>{t("columns.achievement")}</TableHead>
              <TableHead>{t("common.status")}</TableHead>
              <TableHead className="pe-4 text-end">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((kpi, index) => {
              const score = kpiAchievement(kpi, year);
              const entry = kpi.yearly[year];
              const Arrow = kpi.direction === "higher" ? ArrowUp : ArrowDown;
              return (
                <TableRow key={kpi.id} className={ENTER_ROW} style={staggerDelay(index, 30)}>
                  <TableCell className="max-w-72 ps-4">
                    <span className="flex items-center gap-2 font-medium">
                      <Arrow
                        className="size-3.5 shrink-0 text-gold"
                        aria-label={t(`direction.${kpi.direction}`)}
                      />
                      <span className="truncate">{l(kpi.name)}</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{t(`frequency.${kpi.frequency}`)}</TableCell>
                  <TableCell className="tabular-nums">{value(kpi.baseline, kpi.unit)}</TableCell>
                  <TableCell className="tabular-nums">{value(entry?.target, kpi.unit)}</TableCell>
                  <TableCell className="tabular-nums font-semibold">{value(entry?.actual, kpi.unit)}</TableCell>
                  <TableCell className="tabular-nums">
                    {format.number(kpi.weight / 100, { style: "percent" })}
                  </TableCell>
                  <TableCell><ScoreBar score={score} /></TableCell>
                  <TableCell><StatusBadge status={statusFor(score)} /></TableCell>
                  <TableCell className="pe-4">
                    <RowActions
                      onEdit={() => setDialog({ open: true, item: kpi })}
                      onDelete={() => deleteKpi(kpi.id)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">
                  {t("strategy.noKpis")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <KpiFormDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
        objectiveId={objectiveId}
        kpi={dialog.item}
      />
    </div>
  );
}
