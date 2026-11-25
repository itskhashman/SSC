"use client";

import { useFormikContext } from "formik";
import { useTranslations } from "next-intl";
import type { Objective } from "@/domain/strategy";
import { useLocalize, useStrategyData } from "@/hooks/useStrategy";
import { remainingWeight } from "@/rules/weights";
import {
  objectiveSchema,
  type ObjectiveFormValues,
} from "@/schemas/strategySchemas";
import { useStrategyStore } from "@/store/strategyStore";
import FormDialog from "@/components/common/form/FormDialog";
import {
  NumberField,
  SelectField,
  TextareaField,
  TextField,
} from "@/components/common/form/FormFields";

function toValues(perspectiveId: string, o?: Objective): ObjectiveFormValues {
  return {
    perspectiveId: o?.perspectiveId ?? perspectiveId,
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
  perspectiveId,
  objective,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Default perspective for a new objective. */
  perspectiveId: string;
  /** Omit to create a new objective. */
  objective?: Objective;
}) {
  const t = useTranslations();
  const tv = useTranslations("validation");
  const l = useLocalize();
  const { perspectives, objectives } = useStrategyData();
  const { addObjective, updateObjective } = useStrategyStore();

  const maxFor = (pid: string) =>
    remainingWeight(
      objectives.filter((o) => o.perspectiveId === pid),
      objective?.id,
    );

  return (
    <FormDialog<ObjectiveFormValues>
      open={open}
      onOpenChange={onOpenChange}
      title={t(objective ? "strategy.editObjective" : "strategy.addObjective")}
      initialValues={toValues(perspectiveId, objective)}
      validationSchema={objectiveSchema((k, v) => tv(k, v), maxFor)}
      onSubmit={(v) => {
        const input = {
          perspectiveId: v.perspectiveId,
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
        <SelectField
          name="perspectiveId"
          label={t("fields.perspective")}
          className="sm:col-span-2"
          options={perspectives.map((p) => ({ value: p.id, label: l(p.name) }))}
        />
        <TextField name="nameAr" label={t("fields.nameAr")} dir="rtl" />
        <TextField name="nameEn" label={t("fields.nameEn")} dir="ltr" />
        <TextareaField name="descriptionAr" label={t("fields.descriptionAr")} dir="rtl" />
        <TextareaField name="descriptionEn" label={t("fields.descriptionEn")} dir="ltr" />
        <TextField name="owner" label={t("fields.owner")} />
        <WeightField maxFor={maxFor} />
      </div>
    </FormDialog>
  );
}

/** The remaining-weight hint follows the perspective chosen in the form. */
function WeightField({ maxFor }: { maxFor: (perspectiveId: string) => number }) {
  const t = useTranslations();
  const { values } = useFormikContext<ObjectiveFormValues>();
  return (
    <NumberField
      name="weight"
      label={t("fields.weight")}
      hint={t("common.remaining", { value: maxFor(values.perspectiveId) })}
    />
  );
}
