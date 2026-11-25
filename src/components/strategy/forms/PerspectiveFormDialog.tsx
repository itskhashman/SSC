"use client";

import { useTranslations } from "next-intl";
import type { Perspective } from "@/domain/strategy";
import { useStrategyData } from "@/hooks/useStrategy";
import { remainingWeight } from "@/rules/weights";
import {
  perspectiveSchema,
  type PerspectiveFormValues,
} from "@/schemas/strategySchemas";
import { useStrategyStore } from "@/store/strategyStore";
import FormDialog from "@/components/common/form/FormDialog";
import {
  NumberField,
  SelectField,
  TextareaField,
  TextField,
} from "@/components/common/form/FormFields";
import {
  PERSPECTIVE_ICONS,
  PERSPECTIVE_ICON_KEYS,
} from "@/components/common/perspectiveIcons";

function toValues(p?: Perspective): PerspectiveFormValues {
  return {
    nameAr: p?.name.ar ?? "",
    nameEn: p?.name.en ?? "",
    descriptionAr: p?.description.ar ?? "",
    descriptionEn: p?.description.en ?? "",
    weight: p?.weight ?? "",
    icon: p?.icon ?? "target",
  };
}

export default function PerspectiveFormDialog({
  open,
  onOpenChange,
  perspective,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Omit to create a new perspective. */
  perspective?: Perspective;
}) {
  const t = useTranslations();
  const tv = useTranslations("validation");
  const { perspectives } = useStrategyData();
  const { addPerspective, updatePerspective } = useStrategyStore();
  const max = remainingWeight(perspectives, perspective?.id);

  return (
    <FormDialog<PerspectiveFormValues>
      open={open}
      onOpenChange={onOpenChange}
      title={t(perspective ? "strategy.editPerspective" : "strategy.addPerspective")}
      initialValues={toValues(perspective)}
      validationSchema={perspectiveSchema((k, v) => tv(k, v), max)}
      onSubmit={(v) => {
        const input = {
          name: { ar: v.nameAr, en: v.nameEn },
          description: { ar: v.descriptionAr, en: v.descriptionEn },
          weight: Number(v.weight),
          icon: v.icon,
        };
        if (perspective) updatePerspective(perspective.id, input);
        else addPerspective(input);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="nameAr" label={t("fields.nameAr")} dir="rtl" />
        <TextField name="nameEn" label={t("fields.nameEn")} dir="ltr" />
        <TextareaField name="descriptionAr" label={t("fields.descriptionAr")} dir="rtl" />
        <TextareaField name="descriptionEn" label={t("fields.descriptionEn")} dir="ltr" />
        <NumberField
          name="weight"
          label={t("fields.weight")}
          hint={t("common.remaining", { value: max })}
        />
        <SelectField
          name="icon"
          label={t("fields.icon")}
          options={PERSPECTIVE_ICON_KEYS.map((key) => {
            const Icon = PERSPECTIVE_ICONS[key];
            return {
              value: key,
              label: (
                <span className="flex items-center gap-2">
                  <Icon className="size-4 text-gold" /> {t(`icons.${key}`)}
                </span>
              ),
            };
          })}
        />
      </div>
    </FormDialog>
  );
}
