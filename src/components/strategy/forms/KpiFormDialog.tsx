"use client";

import { useFormikContext } from "formik";
import { useTranslations } from "next-intl";
import type { Kpi, KpiYear } from "@/domain/strategy";
import { useStrategyData, useStrategyYears } from "@/hooks/useStrategy";
import { remainingWeight } from "@/rules/weights";
import { kpiSchema, type KpiFormValues } from "@/schemas/strategySchemas";
import { useStrategyStore } from "@/store/strategyStore";
import FormDialog from "@/components/common/form/FormDialog";
import {
  CellNumberField,
  NumberField,
  SelectField,
  TextField,
} from "@/components/common/form/FormFields";

function toValues(years: number[], k?: Kpi): KpiFormValues {
  return {
    nameAr: k?.name.ar ?? "",
    nameEn: k?.name.en ?? "",
    unit: k?.unit ?? "%",
    frequency: k?.frequency ?? "yearly",
    direction: k?.direction ?? "higher",
    baseline: k?.baseline ?? "",
    weight: k?.weight ?? "",
    years: years.map((year) => ({
      year,
      target: k?.yearly[year]?.target ?? "",
      actual: k?.yearly[year]?.actual ?? "",
    })),
  };
}

const toNumberOrNull = (v: number | string | null) =>
  v === null || v === "" ? null : Number(v);

export default function KpiFormDialog({
  open,
  onOpenChange,
  objectiveId,
  kpi,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  objectiveId: string;
  /** Omit to create a new KPI. */
  kpi?: Kpi;
}) {
  const t = useTranslations();
  const tv = useTranslations("validation");
  const years = useStrategyYears();
  const { kpis } = useStrategyData();
  const { addKpi, updateKpi } = useStrategyStore();
  const max = remainingWeight(
    kpis.filter((k) => k.objectiveId === objectiveId),
    kpi?.id,
  );

  return (
    <FormDialog<KpiFormValues>
      open={open}
      onOpenChange={onOpenChange}
      title={t(kpi ? "strategy.editKpi" : "strategy.addKpi")}
      initialValues={toValues(years, kpi)}
      validationSchema={kpiSchema((k, v) => tv(k, v), max)}
      onSubmit={(v) => {
        const yearly: Record<string, KpiYear> = {};
        for (const row of v.years) {
          yearly[row.year] = {
            target: toNumberOrNull(row.target),
            actual: toNumberOrNull(row.actual),
          };
        }
        const input = {
          objectiveId,
          name: { ar: v.nameAr, en: v.nameEn },
          unit: v.unit,
          frequency: v.frequency,
          direction: v.direction,
          baseline: Number(v.baseline),
          weight: Number(v.weight),
          yearly,
        };
        if (kpi) updateKpi(kpi.id, input);
        else addKpi(input);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="nameAr" label={t("fields.nameAr")} dir="rtl" />
        <TextField name="nameEn" label={t("fields.nameEn")} dir="ltr" />
        <TextField name="unit" label={t("fields.unit")} />
        <SelectField
          name="frequency"
          label={t("fields.frequency")}
          options={(["monthly", "quarterly", "yearly"] as const).map((f) => ({
            value: f,
            label: t(`frequency.${f}`),
          }))}
        />
        <SelectField
          name="direction"
          label={t("fields.direction")}
          options={(["higher", "lower"] as const).map((d) => ({
            value: d,
            label: t(`direction.${d}`),
          }))}
        />
        <NumberField name="baseline" label={t("fields.baseline")} />
        <NumberField
          name="weight"
          label={t("fields.weight")}
          hint={t("common.remaining", { value: max })}
        />
      </div>
      <KpiYearsTable />
    </FormDialog>
  );
}

/** Target and actual for every year of the strategy. */
function KpiYearsTable() {
  const t = useTranslations();
  const { values } = useFormikContext<KpiFormValues>();

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{t("fields.yearlyValues")}</p>
      <p className="text-xs text-muted-foreground">{t("fields.actualHint")}</p>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-muted-foreground">
            <tr>
              <th className="p-2 text-start font-medium">{t("common.year")}</th>
              <th className="p-2 text-start font-medium">{t("fields.target")}</th>
              <th className="p-2 text-start font-medium">{t("fields.actual")}</th>
            </tr>
          </thead>
          <tbody>
            {values.years.map((row, index) => (
              <tr key={row.year} className="border-t align-top">
                <td className="p-2 font-semibold tabular-nums">{row.year}</td>
                <td className="p-2">
                  <CellNumberField
                    name={`years.${index}.target`}
                    ariaLabel={`${t("fields.target")} ${row.year}`}
                    suffix={values.unit}
                  />
                </td>
                <td className="p-2">
                  <CellNumberField
                    name={`years.${index}.actual`}
                    ariaLabel={`${t("fields.actual")} ${row.year}`}
                    suffix={values.unit}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
