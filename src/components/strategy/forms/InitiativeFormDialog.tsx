"use client";

import { useFormikContext } from "formik";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { SCORING_CONFIG } from "@/config/scoring";
import type { Initiative, InitiativeStatus, InitiativeYear } from "@/domain/strategy";
import { useLocalize, useStrategyData, useStrategyYears } from "@/hooks/useStrategy";
import { remainingWeight } from "@/rules/weights";
import {
  initiativeSchema,
  type InitiativeFormValues,
} from "@/schemas/strategySchemas";
import { useStrategyStore } from "@/store/strategyStore";
import { cn } from "@/lib/utils";
import FormDialog from "@/components/common/form/FormDialog";
import {
  CellNumberField,
  NumberField,
  SelectField,
  TextField,
} from "@/components/common/form/FormFields";

export const INITIATIVE_STATUSES: InitiativeStatus[] = [
  "notStarted",
  "inProgress",
  "onHold",
  "completed",
];

function toValues(
  years: number[],
  objectiveId: string,
  i?: Initiative,
): InitiativeFormValues {
  return {
    objectiveId: i?.objectiveId ?? objectiveId,
    nameAr: i?.name.ar ?? "",
    nameEn: i?.name.en ?? "",
    owner: i?.owner ?? "",
    status: i?.status ?? "notStarted",
    weight: i?.weight ?? "",
    years: years.map((year) => ({
      year,
      weight: i?.yearly[year]?.weight ?? "",
      achievement: i?.yearly[year]?.achievement ?? "",
    })),
  };
}

export default function InitiativeFormDialog({
  open,
  onOpenChange,
  objectiveId = "",
  initiative,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-selected objective for a new initiative. */
  objectiveId?: string;
  /** Omit to create a new initiative. */
  initiative?: Initiative;
}) {
  const t = useTranslations();
  const tv = useTranslations("validation");
  const years = useStrategyYears();
  const { initiatives } = useStrategyData();
  const { addInitiative, updateInitiative } = useStrategyStore();

  const maxFor = (oid: string) =>
    remainingWeight(
      initiatives.filter((i) => i.objectiveId === oid),
      initiative?.id,
    );

  return (
    <FormDialog<InitiativeFormValues>
      open={open}
      onOpenChange={onOpenChange}
      title={t(initiative ? "strategy.editInitiative" : "strategy.addInitiative")}
      initialValues={toValues(years, objectiveId, initiative)}
      validationSchema={initiativeSchema((k, v) => tv(k, v), maxFor)}
      onSubmit={(v) => {
        const yearly: Record<string, InitiativeYear> = {};
        for (const row of v.years) {
          yearly[row.year] = {
            weight: Number(row.weight) || 0,
            achievement:
              row.achievement === null || row.achievement === ""
                ? null
                : Number(row.achievement),
          };
        }
        const input = {
          objectiveId: v.objectiveId,
          name: { ar: v.nameAr, en: v.nameEn },
          owner: v.owner,
          status: v.status,
          weight: Number(v.weight),
          yearly,
        };
        if (initiative) updateInitiative(initiative.id, input);
        else addInitiative(input);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="nameAr" label={t("fields.nameAr")} dir="rtl" />
        <TextField name="nameEn" label={t("fields.nameEn")} dir="ltr" />
        <ObjectivePicker />
        <WeightField maxFor={maxFor} />
        <TextField name="owner" label={t("fields.owner")} />
        <SelectField
          name="status"
          label={t("fields.status")}
          options={INITIATIVE_STATUSES.map((s) => ({
            value: s,
            label: t(`initiativeStatus.${s}`),
          }))}
        />
      </div>
      <InitiativeYearsTable />
    </FormDialog>
  );
}

/** Objective dropdown with the objective's weight shown below. */
function ObjectivePicker() {
  const t = useTranslations();
  const l = useLocalize();
  const format = useFormatter();
  const { objectives } = useStrategyData();
  const { values } = useFormikContext<InitiativeFormValues>();
  const selected = objectives.find((o) => o.id === values.objectiveId);
  const options = objectives.map((o) => ({ value: o.id, label: l(o.name) }));

  return (
    <SelectField
      name="objectiveId"
      label={t("fields.objective")}
      className="sm:col-span-2"
      options={options}
      hint={
        selected
          ? t("fields.objectiveWeight", {
              value: format.number(selected.weight / 100, { style: "percent" }),
            })
          : options.length === 0
            ? t("strategy.noObjectivesYet")
            : undefined
      }
    />
  );
}

/** The remaining-weight hint follows the objective chosen in the form. */
function WeightField({ maxFor }: { maxFor: (objectiveId: string) => number }) {
  const t = useTranslations();
  const { values } = useFormikContext<InitiativeFormValues>();
  return (
    <NumberField
      name="weight"
      label={t("fields.initiativeWeight")}
      hint={values.objectiveId ? t("common.remaining", { value: maxFor(values.objectiveId) }) : undefined}
    />
  );
}

/** Year weight (share of the initiative) and achievement for every strategy year. */
function InitiativeYearsTable() {
  const t = useTranslations();
  const format = useFormatter();
  const { values, errors, submitCount } = useFormikContext<InitiativeFormValues>();
  const total = values.years.reduce((sum, row) => sum + (Number(row.weight) || 0), 0);
  const ok = Math.abs(total - SCORING_CONFIG.weightTotal) < 0.01;
  const sumError = typeof errors.years === "string" && submitCount > 0;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{t("fields.yearlyPlan")}</p>
      <p className="text-xs text-muted-foreground">{t("fields.yearlyPlanHint")}</p>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-muted-foreground">
            <tr>
              <th className="p-2 text-start font-medium">{t("common.year")}</th>
              <th className="p-2 text-start font-medium">{t("fields.yearWeight")}</th>
              <th className="p-2 text-start font-medium">{t("fields.achievement")}</th>
              <th className="p-2 text-start font-medium">{t("fields.contribution")}</th>
            </tr>
          </thead>
          <tbody>
            {values.years.map((row, index) => {
              const contribution =
                ((Number(row.weight) || 0) * (Number(row.achievement) || 0)) / 10000;
              return (
                <tr key={row.year} className="border-t align-top">
                  <td className="p-2 font-semibold tabular-nums">{row.year}</td>
                  <td className="p-2">
                    <CellNumberField
                      name={`years.${index}.weight`}
                      ariaLabel={`${t("fields.yearWeight")} ${row.year}`}
                      suffix="%"
                    />
                  </td>
                  <td className="p-2">
                    <CellNumberField
                      name={`years.${index}.achievement`}
                      ariaLabel={`${t("fields.achievement")} ${row.year}`}
                      suffix="%"
                    />
                  </td>
                  <td className="p-2 pt-3.5 tabular-nums text-muted-foreground">
                    {format.number(contribution, { style: "percent", maximumFractionDigits: 1 })}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t bg-muted/40">
              <td className="p-2 font-medium">{t("common.total")}</td>
              <td
                colSpan={3}
                className={cn(
                  "p-2 font-semibold tabular-nums",
                  ok ? "text-status-on-track" : "text-status-at-risk",
                )}
              >
                <span className="inline-flex items-center gap-1.5">
                  {ok ? <CheckCircle2 className="size-4" /> : <AlertTriangle className="size-4" />}
                  {t("common.weightTotal", { total, expected: SCORING_CONFIG.weightTotal })}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      {sumError && <p className="text-xs text-destructive">{errors.years as string}</p>}
    </div>
  );
}
