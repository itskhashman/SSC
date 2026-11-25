"use client";

import { useTranslations } from "next-intl";
import { useStrategyData } from "@/hooks/useStrategy";
import { useUiStore } from "@/store/uiStore";
import PageTitle from "@/components/common/PageTitle";
import HydrationGate from "@/components/common/HydrationGate";
import YearSelect from "@/components/common/YearSelect";
import StrategyHeader from "./StrategyHeader";
import PerspectivesPanel from "./PerspectivesPanel";
import ObjectivesPanel from "./ObjectivesPanel";
import ObjectiveDetail from "./ObjectiveDetail";

export default function StrategyView() {
  const t = useTranslations("strategy");

  return (
    <>
      <PageTitle title={t("title")} subtitle={t("subtitle")} actions={<YearSelect />} />
      <HydrationGate>
        <StrategyContent />
      </HydrationGate>
    </>
  );
}

/**
 * Perspective → objective drill-down. Falls back to the first item when
 * nothing (or a deleted item) is selected.
 */
function StrategyContent() {
  const { perspectives, objectives } = useStrategyData();
  const { selectedPerspectiveId, selectedObjectiveId } = useUiStore();

  const perspective =
    perspectives.find((p) => p.id === selectedPerspectiveId) ?? perspectives[0];
  const perspectiveObjectives = perspective
    ? objectives.filter((o) => o.perspectiveId === perspective.id)
    : [];
  const objective =
    perspectiveObjectives.find((o) => o.id === selectedObjectiveId) ??
    perspectiveObjectives[0];

  return (
    <div className="space-y-6">
      <StrategyHeader />
      <PerspectivesPanel activeId={perspective?.id} />
      {perspective && (
        <ObjectivesPanel perspective={perspective} activeId={objective?.id} />
      )}
      {objective && <ObjectiveDetail objective={objective} />}
    </div>
  );
}
