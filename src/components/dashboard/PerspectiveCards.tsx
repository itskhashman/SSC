"use client";

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
import { PERSPECTIVE_ICONS } from "@/components/common/perspectiveIcons";

/** One gold card per perspective, styled like the SSC home-page cards. */
export default function PerspectiveCards({ startIndex = 0 }: { startIndex?: number }) {
  const t = useTranslations("common");
  const l = useLocalize();
  const format = useFormatter();
  const router = useRouter();
  const selectPerspective = useUiStore((s) => s.selectPerspective);
  const { perspectives, objectives } = useStrategyData();
  const scores = useStrategyScores();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {perspectives.map((perspective, index) => {
        const Icon = PERSPECTIVE_ICONS[perspective.icon];
        const score = scores.perspectives[perspective.id] ?? null;
        const objectiveCount = objectives.filter(
          (o) => o.perspectiveId === perspective.id,
        ).length;

        return (
          <button
            key={perspective.id}
            type="button"
            className={cn("group rounded-xl text-start focus-visible:outline-2 focus-visible:outline-ring", ENTER_UP)}
            style={staggerDelay(startIndex + index)}
            onClick={() => {
              selectPerspective(perspective.id);
              router.push("/strategy");
            }}
          >
            <GoldCard interactive className="h-full" bodyClassName="flex h-full flex-col items-center gap-3 text-center">
              <Icon
                className="size-10 text-gold transition-transform duration-300 group-hover:scale-110"
                strokeWidth={1.75}
              />
              <h3 className="text-base font-semibold">{l(perspective.name)}</h3>
              <p className="text-xs text-muted-foreground">
                {t("weightValue", { value: format.number(perspective.weight) })} ·{" "}
                {t("objectivesCount", { count: objectiveCount })}
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
