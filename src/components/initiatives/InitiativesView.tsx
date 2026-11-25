"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocalize, useStrategyData } from "@/hooks/useStrategy";
import GoldCard from "@/components/common/GoldCard";
import HydrationGate from "@/components/common/HydrationGate";
import Reveal from "@/components/common/Reveal";
import PageTitle from "@/components/common/PageTitle";
import YearSelect from "@/components/common/YearSelect";
import InitiativesTable from "@/components/strategy/InitiativesTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL = "all";

/** Every initiative across the strategy, for the selected year. */
export default function InitiativesView() {
  const t = useTranslations("initiatives");

  return (
    <>
      <PageTitle title={t("title")} subtitle={t("subtitle")} actions={<YearSelect />} />
      <HydrationGate>
        <InitiativesContent />
      </HydrationGate>
    </>
  );
}

function InitiativesContent() {
  const t = useTranslations();
  const l = useLocalize();
  const { objectives, initiatives } = useStrategyData();
  const [objectiveFilter, setObjectiveFilter] = useState<string>(ALL);

  const options = [
    { value: ALL, label: t("initiatives.allObjectives") },
    ...objectives.map((o) => ({ value: o.id, label: l(o.name) })),
  ];
  const rows =
    objectiveFilter === ALL
      ? initiatives
      : initiatives.filter((i) => i.objectiveId === objectiveFilter);

  return (
    <Reveal>
    <GoldCard bodyClassName="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground">{t("initiatives.filterByObjective")}</span>
        <Select
          items={options}
          value={objectiveFilter}
          onValueChange={(value) => setObjectiveFilter((value as string) ?? ALL)}
        >
          <SelectTrigger className="min-w-64 max-w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <InitiativesTable
        rows={rows}
        objectiveId={objectiveFilter === ALL ? undefined : objectiveFilter}
        showWeightSummary={objectiveFilter !== ALL}
      />
    </GoldCard>
    </Reveal>
  );
}
