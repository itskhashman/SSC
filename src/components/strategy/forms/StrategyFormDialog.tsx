"use client";

import { useTranslations } from "next-intl";
import type { Strategy } from "@/domain/strategy";
import { strategySchema, type StrategyFormValues } from "@/schemas/strategySchemas";
import { useStrategyStore } from "@/store/strategyStore";
import FormDialog from "@/components/common/form/FormDialog";
import { NumberField, TextField } from "@/components/common/form/FormFields";

function toValues(s: Strategy | null): StrategyFormValues {
  const year = new Date().getFullYear();
  return {
    nameAr: s?.name.ar ?? "",
    nameEn: s?.name.en ?? "",
    startYear: s?.startYear ?? year,
    endYear: s?.endYear ?? year + 2,
  };
}

export default function StrategyFormDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations();
  const tv = useTranslations("validation");
  const strategy = useStrategyStore((s) => s.strategy);
  const saveStrategy = useStrategyStore((s) => s.saveStrategy);

  return (
    <FormDialog<StrategyFormValues>
      open={open}
      onOpenChange={onOpenChange}
      title={t(strategy ? "setup.editTitle" : "setup.createTitle")}
      description={strategy ? t("setup.rangeWarning") : undefined}
      initialValues={toValues(strategy)}
      validationSchema={strategySchema((k, v) => tv(k, v))}
      onSubmit={(v) =>
        saveStrategy({
          name: { ar: v.nameAr, en: v.nameEn },
          startYear: Number(v.startYear),
          endYear: Number(v.endYear),
        })
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="nameAr" label={t("fields.nameAr")} dir="rtl" />
        <TextField name="nameEn" label={t("fields.nameEn")} dir="ltr" />
        <NumberField name="startYear" label={t("fields.startYear")} step="1" />
        <NumberField name="endYear" label={t("fields.endYear")} step="1" />
      </div>
    </FormDialog>
  );
}
