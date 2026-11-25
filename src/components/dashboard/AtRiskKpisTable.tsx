"use client";

import { AlertTriangle } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useLocalize, useSelectedYear, useStrategyData } from "@/hooks/useStrategy";
import { kpiAchievement, statusFor } from "@/rules/scoring";
import { ENTER_ROW, staggerDelay } from "@/lib/motion";
import GoldCard from "@/components/common/GoldCard";
import ScoreBar from "@/components/common/ScoreBar";
import StatusBadge from "@/components/common/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/** KPIs below the "on track" threshold, worst first. */
export default function AtRiskKpisTable() {
  const t = useTranslations();
  const l = useLocalize();
  const format = useFormatter();
  const { kpis, objectives } = useStrategyData();
  const year = useSelectedYear();

  const rows = kpis
    .map((kpi) => ({ kpi, score: kpiAchievement(kpi, year) }))
    .filter(({ score }) => {
      const status = statusFor(score);
      return status === "atRisk" || status === "offTrack";
    })
    .sort((a, b) => (a.score ?? 0) - (b.score ?? 0));

  const value = (n: number | null | undefined, unit: string) =>
    n === null || n === undefined ? "—" : `${format.number(n)} ${unit}`;

  return (
    <GoldCard bodyClassName="p-0">
      <h2 className="flex items-center gap-2 p-5 pb-3 font-semibold">
        <AlertTriangle className="size-5 text-status-at-risk" />
        {t("dashboard.atRiskKpis", { year })}
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="ps-5">{t("columns.kpi")}</TableHead>
            <TableHead>{t("columns.objective")}</TableHead>
            <TableHead>{t("columns.baseline")}</TableHead>
            <TableHead>{t("columns.targetFor", { year })}</TableHead>
            <TableHead>{t("columns.actualFor", { year })}</TableHead>
            <TableHead>{t("columns.achievement")}</TableHead>
            <TableHead className="pe-5">{t("common.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ kpi, score }, index) => {
            const objective = objectives.find((o) => o.id === kpi.objectiveId);
            return (
              <TableRow key={kpi.id} className={ENTER_ROW} style={staggerDelay(index, 30)}>
                <TableCell className="max-w-64 truncate ps-5 font-medium">{l(kpi.name)}</TableCell>
                <TableCell className="max-w-56 truncate text-muted-foreground">
                  {objective ? l(objective.name) : "—"}
                </TableCell>
                <TableCell className="tabular-nums">{format.number(kpi.baseline)} {kpi.unit}</TableCell>
                <TableCell className="tabular-nums">{value(kpi.yearly[year]?.target, kpi.unit)}</TableCell>
                <TableCell className="tabular-nums">
                  {value(kpi.yearly[year]?.actual, kpi.unit)}
                </TableCell>
                <TableCell><ScoreBar score={score} /></TableCell>
                <TableCell className="pe-5"><StatusBadge status={statusFor(score)} /></TableCell>
              </TableRow>
            );
          })}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                {t("dashboard.noRisks")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </GoldCard>
  );
}
