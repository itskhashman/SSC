import * as yup from "yup";
import { SCORING_CONFIG } from "@/config/scoring";
import type {
  InitiativeStatus,
  KpiDirection,
  KpiFrequency,
  PerspectiveIcon,
} from "@/domain/strategy";

/**
 * Yup schemas for every form. Messages come from next-intl's
 * "validation" namespace, passed in as `t`.
 */
export type ValidationT = (key: string, values?: Record<string, string | number>) => string;

/** Casts "" from an empty <input type="number"> to undefined so `required` fires. */
const number = (t: ValidationT) =>
  yup
    .number()
    .transform((value, original) => (original === "" ? undefined : value))
    .typeError(t("number"));

/** Optional number: "" / null → null. */
const optionalNumber = (t: ValidationT) =>
  yup
    .number()
    .transform((value, original) =>
      original === "" || original === null || original === undefined ? null : value,
    )
    .typeError(t("number"))
    .nullable()
    .default(null);

const percent = (t: ValidationT) =>
  optionalNumber(t).min(0, t("min", { min: 0 })).max(100, t("max", { max: 100 }));

/**
 * Weight field: 0–total, and no more than what the siblings leave over.
 * `maxFor` receives the sibling form values (e.g. the chosen objective).
 */
function weight(t: ValidationT, maxFor: (parent: Record<string, unknown>) => number) {
  return number(t)
    .required(t("required"))
    .min(0, t("min", { min: 0 }))
    .test("fits-remaining", function (value) {
      if (value === undefined) return true;
      const max = maxFor(this.parent);
      return value <= max
        ? true
        : this.createError({ message: t("weightExceeds", { max }) });
    });
}

const bilingual = (t: ValidationT) => ({
  nameAr: yup.string().trim().required(t("required")),
  nameEn: yup.string().trim().default(""),
});

// ── Strategy ──────────────────────────────────────────────────

export interface StrategyFormValues {
  nameAr: string;
  nameEn: string;
  startYear: number | string;
  endYear: number | string;
}

export function strategySchema(t: ValidationT) {
  const year = () =>
    number(t)
      .required(t("required"))
      .integer(t("integer"))
      .min(2000, t("min", { min: 2000 }))
      .max(2100, t("max", { max: 2100 }));
  return yup.object({
    ...bilingual(t),
    startYear: year(),
    endYear: year()
      .test("after-start", t("endYearAfterStart"), function (value) {
        const start = Number(this.parent.startYear);
        return value === undefined || Number.isNaN(start) || value >= start;
      })
      .test("max-span", function (value) {
        const start = Number(this.parent.startYear);
        const max = SCORING_CONFIG.maxStrategyYears;
        if (value === undefined || Number.isNaN(start) || value - start + 1 <= max) return true;
        return this.createError({ message: t("maxYears", { max }) });
      }),
  });
}

// ── Perspective ───────────────────────────────────────────────

export interface PerspectiveFormValues {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  weight: number | string;
  icon: PerspectiveIcon;
}

export function perspectiveSchema(t: ValidationT, maxWeight: number) {
  return yup.object({
    ...bilingual(t),
    descriptionAr: yup.string().default(""),
    descriptionEn: yup.string().default(""),
    weight: weight(t, () => maxWeight),
    icon: yup.string().required(t("required")),
  });
}

// ── Objective ─────────────────────────────────────────────────

export interface ObjectiveFormValues {
  perspectiveId: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  owner: string;
  weight: number | string;
}

export function objectiveSchema(
  t: ValidationT,
  maxWeightFor: (perspectiveId: string) => number,
) {
  return yup.object({
    perspectiveId: yup.string().required(t("required")),
    ...bilingual(t),
    descriptionAr: yup.string().default(""),
    descriptionEn: yup.string().default(""),
    owner: yup.string().trim().default(""),
    weight: weight(t, (parent) => maxWeightFor(String(parent.perspectiveId ?? ""))),
  });
}

// ── KPI ───────────────────────────────────────────────────────

export interface KpiYearFormValues {
  year: number;
  target: number | string | null;
  actual: number | string | null;
}

export interface KpiFormValues {
  nameAr: string;
  nameEn: string;
  unit: string;
  frequency: KpiFrequency;
  direction: KpiDirection;
  baseline: number | string;
  weight: number | string;
  /** One row per strategy year. */
  years: KpiYearFormValues[];
}

export function kpiSchema(t: ValidationT, maxWeight: number) {
  return yup.object({
    ...bilingual(t),
    unit: yup.string().trim().default(""),
    frequency: yup.string().required(t("required")),
    direction: yup.string().required(t("required")),
    baseline: number(t).required(t("required")),
    weight: weight(t, () => maxWeight),
    years: yup.array(
      yup.object({
        year: yup.number().required(),
        target: optionalNumber(t),
        actual: optionalNumber(t).test("needs-target", t("actualNeedsTarget"), function (value) {
          return value === null || (this.parent.target !== null && this.parent.target !== "");
        }),
      }),
    ),
  });
}

// ── Initiative ────────────────────────────────────────────────

export interface InitiativeYearFormValues {
  year: number;
  /** Share of the initiative planned for this year (0–100). */
  weight: number | string;
  /** Achievement of this year's share (0–100), empty = not entered. */
  achievement: number | string | null;
}

export interface InitiativeFormValues {
  objectiveId: string;
  nameAr: string;
  nameEn: string;
  owner: string;
  status: InitiativeStatus;
  weight: number | string;
  /** One row per strategy year. */
  years: InitiativeYearFormValues[];
}

export function initiativeSchema(
  t: ValidationT,
  maxWeightFor: (objectiveId: string) => number,
) {
  return yup.object({
    objectiveId: yup.string().required(t("required")),
    ...bilingual(t),
    owner: yup.string().trim().default(""),
    status: yup.string().required(t("required")),
    weight: weight(t, (parent) => maxWeightFor(String(parent.objectiveId ?? ""))),
    years: yup
      .array(
        yup.object({
          year: yup.number().required(),
          weight: number(t)
            .default(0)
            .min(0, t("min", { min: 0 }))
            .max(100, t("max", { max: 100 })),
          achievement: percent(t),
        }),
      )
      .test("years-sum", function (rows) {
        const total = (rows ?? []).reduce((sum, row) => sum + (Number(row.weight) || 0), 0);
        const expected = SCORING_CONFIG.weightTotal;
        return Math.abs(total - expected) < 0.01
          ? true
          : this.createError({ message: t("yearWeightsSum", { total, expected }) });
      }),
  });
}
