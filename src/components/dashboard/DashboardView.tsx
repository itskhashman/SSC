"use client";

import { useTranslations } from "next-intl";
import PageTitle from "@/components/common/PageTitle";
import HydrationGate from "@/components/common/HydrationGate";
import YearSelect from "@/components/common/YearSelect";
import OverallScoreCard from "./OverallScoreCard";
import PerspectiveCards from "./PerspectiveCards";
import PerspectiveScoreChart from "./PerspectiveScoreChart";
import YearlyTrendChart from "./YearlyTrendChart";
import KpiStatusChart from "./KpiStatusChart";
import ObjectivesScoreTable from "./ObjectivesScoreTable";
import AtRiskKpisTable from "./AtRiskKpisTable";

export default function DashboardView() {
  const t = useTranslations("dashboard");

  return (
    <>
      <PageTitle title={t("title")} subtitle={t("subtitle")} actions={<YearSelect />} />
      <HydrationGate>
        <div className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <OverallScoreCard />
            <PerspectiveScoreChart />
          </div>
          <PerspectiveCards />
          <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <YearlyTrendChart />
            <KpiStatusChart />
          </div>
          <ObjectivesScoreTable />
          <AtRiskKpisTable />
        </div>
      </HydrationGate>
    </>
  );
}
