"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useLocalize, useStrategyData, useStrategyScores } from "@/hooks/useStrategy";
import { statusFor } from "@/rules/scoring";
import { useUiStore } from "@/store/uiStore";
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

export default function ObjectivesScoreTable() {
  const t = useTranslations();
  const l = useLocalize();
  const format = useFormatter();
  const router = useRouter();
  const selectObjective = useUiStore((s) => s.selectObjective);
  const { perspectives, objectives } = useStrategyData();
  const scores = useStrategyScores();

  return (
    <GoldCard bodyClassName="p-0">
      <h2 className="p-5 pb-3 font-semibold">{t("dashboard.objectivesTable")}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="ps-5">{t("columns.objective")}</TableHead>
            <TableHead>{t("columns.perspective")}</TableHead>
            <TableHead>{t("common.weight")}</TableHead>
            <TableHead>{t("columns.kpiScore")}</TableHead>
            <TableHead>{t("columns.initiativeScore")}</TableHead>
            <TableHead>{t("columns.score")}</TableHead>
            <TableHead className="pe-5">{t("common.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {objectives.map((objective) => {
            const perspective = perspectives.find((p) => p.id === objective.perspectiveId);
            const score = scores.objectives[objective.id];
            return (
              <TableRow
                key={objective.id}
                className="cursor-pointer"
                onClick={() => {
                  selectObjective(objective.id, objective.perspectiveId);
                  router.push("/strategy");
                }}
              >
                <TableCell className="max-w-64 truncate ps-5 font-medium">{l(objective.name)}</TableCell>
                <TableCell className="max-w-48 truncate text-muted-foreground">
                  {perspective ? l(perspective.name) : "—"}
                </TableCell>
                <TableCell className="tabular-nums">{format.number(objective.weight / 100, { style: "percent" })}</TableCell>
                <TableCell><ScoreBar score={score?.kpis ?? null} /></TableCell>
                <TableCell><ScoreBar score={score?.initiatives ?? null} /></TableCell>
                <TableCell><ScoreBar score={score?.total ?? null} /></TableCell>
                <TableCell className="pe-5"><StatusBadge status={statusFor(score?.total ?? null)} /></TableCell>
              </TableRow>
            );
          })}
          {objectives.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                {t("common.noData")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </GoldCard>
  );
}
