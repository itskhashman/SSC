"use client";

import { useTranslations } from "next-intl";
import { useStrategyData } from "@/hooks/useStrategy";
import { useUiStore } from "@/store/uiStore";
import PageTitle from "@/components/common/PageTitle";
import HydrationGate from "@/components/common/HydrationGate";
import YearSelect from "@/components/common/YearSelect";
import Reveal from "@/components/common/Reveal";
import StrategyHeader from "./StrategyHeader";
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

/** Strategy → objectives → the selected objective's initiatives. */
function StrategyContent() {
  const { objectives } = useStrategyData();
  const selectedObjectiveId = useUiStore((s) => s.selectedObjectiveId);
  // Falls back to the first objective when nothing (or a deleted one) is selected.
  const objective = objectives.find((o) => o.id === selectedObjectiveId) ?? objectives[0];

  return (
    <div className="space-y-6">
      <Reveal index={0}><StrategyHeader /></Reveal>
      <Reveal index={1}><ObjectivesPanel activeId={objective?.id} /></Reveal>
      {objective && (
        // Keyed so it re-animates when another objective is picked.
        <Reveal key={objective.id} index={2}>
          <ObjectiveDetail objective={objective} />
        </Reveal>
      )}
    </div>
  );
}
