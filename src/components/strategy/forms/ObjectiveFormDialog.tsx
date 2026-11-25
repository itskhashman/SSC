"use client";

import { useTranslations } from "next-intl";
import type { Objective } from "@/domain/strategy";
import { useStrategyData } from "@/hooks/useStrategy";
import { remainingWeight } from "@/rules/weights";
import {
  objectiveSchema,
  type ObjectiveFormValues,
} from "@/schemas/strategySchemas";
import { useStrategyStore } from "@/store/strategyStore";
import FormDialog from "@/components/common/form/FormDialog";
import {
  NumberField,
  TextareaField,
  TextField,
} from "@/components/common/form/FormFields";

function toValues(o?: Objective): ObjectiveFormValues {
  return {
    nameAr: o?.name.ar ?? "",
    nameEn: o?.name.en ?? "",
    descriptionAr: o?.description.ar ?? "",
    descriptionEn: o?.description.en ?? "",
    owner: o?.owner ?? "",
    weight: o?.weight ?? "",
  };
}

export default function ObjectiveFormDialog({
  open,
  onOpenChange,
  objective,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Omit to create a new objective. */
  objective?: Objective;
}) {
  const t = useTranslations();
  const tv = useTranslations("validation");
  const { objectives } = useStrategyData();
  const { addObjective, updateObjective } = useStrategyStore();
  const max = remainingWeight(objectives, objective?.id);

  return (
    <FormDialog<ObjectiveFormValues>
      open={open}
      onOpenChange={onOpenChange}
      title={t(objective ? "strategy.editObjective" : "strategy.addObjective")}
      initialValues={toValues(objective)}
      validationSchema={objectiveSchema((k, v) => tv(k, v), max)}
      onSubmit={(v) => {
        const input = {
          name: { ar: v.nameAr, en: v.nameEn },
          description: { ar: v.descriptionAr, en: v.descriptionEn },
          owner: v.owner,
          weight: Number(v.weight),
        };
        if (objective) updateObjective(objective.id, input);
        else addObjective(input);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="nameAr" label={t("fields.nameAr")} dir="rtl" />
        <TextField name="nameEn" label={t("fields.nameEn")} dir="ltr" />
        <TextareaField name="descriptionAr" label={t("fields.descriptionAr")} dir="rtl" />
        <TextareaField name="descriptionEn" label={t("fields.descriptionEn")} dir="ltr" />
        <TextField name="owner" label={t("fields.owner")} />
        <NumberField
          name="weight"
          label={t("fields.objectiveWeightLabel")}
          hint={t("common.remaining", { value: max })}
        />
      </div>
    </FormDialog>
  );
}
