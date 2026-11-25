"use client";

import { useState } from "react";
import { Plus, Target } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import GoldCard from "./GoldCard";
import StrategyFormDialog from "@/components/strategy/forms/StrategyFormDialog";

/** Empty state shown until the strategy has been created. */
export default function StrategySetup() {
  const t = useTranslations("setup");
  const [open, setOpen] = useState(false);

  return (
    <GoldCard className="mx-auto max-w-xl" bodyClassName="flex flex-col items-center gap-4 p-10 text-center">
      <Target className="size-12 text-gold" strokeWidth={1.5} />
      <h2 className="text-xl font-semibold">{t("emptyTitle")}</h2>
      <p className="text-sm text-muted-foreground">{t("emptyDescription")}</p>
      <ol className="w-full list-decimal space-y-1 rounded-lg bg-muted/60 p-4 ps-8 text-start text-sm">
        <li>{t("step1")}</li>
        <li>{t("step2")}</li>
        <li>{t("step3")}</li>
        <li>{t("step4")}</li>
      </ol>
      <Button onClick={() => setOpen(true)}>
        <Plus /> {t("createTitle")}
      </Button>
      <StrategyFormDialog open={open} onOpenChange={setOpen} />
    </GoldCard>
  );
}
