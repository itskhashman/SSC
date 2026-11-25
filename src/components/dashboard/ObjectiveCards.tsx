"use client";

import { Flag } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useLocalize, useStrategyData, useStrategyScores } from "@/hooks/useStrategy";
import { statusFor } from "@/rules/scoring";
import { useUiStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";
import { ENTER_UP, staggerDelay } from "@/lib/motion";
import GoldCard from "@/components/common/GoldCard";
import ScoreBar from "@/components/common/ScoreBar";
import StatusBadge from "@/components/common/StatusBadge";

/** One gold card per objective, styled like the SSC home-page cards. */
export default function ObjectiveCards({ startIndex = 0 }: { startIndex?: number }) {
  const t = useTranslations("common");
  const l = useLocalize();
  const format = useFormatter();
  const router = useRouter();
  const selectObjective = useUiStore((s) => s.selectObjective);
  const { objectives, initiatives } = useStrategyData();
  const scores = useStrategyScores();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {objectives.map((objective, index) => {
        const score = scores.objectives[objective.id] ?? null;
        const initiativeCount = initiatives.filter((i) => i.objectiveId === objective.id).length;

        return (
          <button
            key={objective.id}
            type="button"
            className={cn("group rounded-xl text-start focus-visible:outline-2 focus-visible:outline-ring", ENTER_UP)}
            style={staggerDelay(startIndex + index)}
            onClick={() => {
              selectObjective(objective.id);
              router.push("/strategy");
            }}
          >
            <GoldCard interactive className="h-full" bodyClassName="flex h-full flex-col items-center gap-3 text-center">
              <Flag
                className="size-10 text-gold transition-transform duration-300 group-hover:scale-110"
                strokeWidth={1.75}
              />
              <h3 className="text-base font-semibold">{l(objective.name)}</h3>
              <p className="text-xs text-muted-foreground">
                {t("weightValue", { value: format.number(objective.weight) })} ·{" "}
                {t("initiativesCount", { count: initiativeCount })}
              </p>
              <ScoreBar score={score} className="mt-auto w-full" />
              <StatusBadge status={statusFor(score)} />
            </GoldCard>
          </button>
        );
      })}
    </div>
  );
}
