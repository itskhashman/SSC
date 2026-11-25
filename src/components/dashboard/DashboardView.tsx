"use client";

import { useTranslations } from "next-intl";
import PageTitle from "@/components/common/PageTitle";
import HydrationGate from "@/components/common/HydrationGate";
import Reveal from "@/components/common/Reveal";
import YearSelect from "@/components/common/YearSelect";
import OverallScoreCard from "./OverallScoreCard";
import ObjectiveCards from "./ObjectiveCards";
import ObjectiveScoreChart from "./ObjectiveScoreChart";
import YearlyTrendChart from "./YearlyTrendChart";
import InitiativeStatusChart from "./InitiativeStatusChart";
import ObjectivesScoreTable from "./ObjectivesScoreTable";
import AtRiskInitiativesTable from "./AtRiskInitiativesTable";

/** Sections fade in top to bottom (Reveal index = order on the page). */
export default function DashboardView() {
  const t = useTranslations("dashboard");

  return (
    <>
      <PageTitle title={t("title")} subtitle={t("subtitle")} actions={<YearSelect />} />
      <HydrationGate>
        <div className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <Reveal index={0}><OverallScoreCard /></Reveal>
            <Reveal index={1}><ObjectiveScoreChart /></Reveal>
          </div>
          <ObjectiveCards startIndex={2} />
          <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <Reveal index={6}><YearlyTrendChart /></Reveal>
            <Reveal index={7}><InitiativeStatusChart /></Reveal>
          </div>
          <Reveal index={8}><ObjectivesScoreTable /></Reveal>
          <Reveal index={9}><AtRiskInitiativesTable /></Reveal>
        </div>
      </HydrationGate>
    </>
  );
}
