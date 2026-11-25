import type { StrategyData } from "@/domain/strategy";

/**
 * Small illustrative plan (2024–2026), loaded only when the user clicks
 * "Load sample data" on the empty-state card.
 */
export const SAMPLE_DATA: StrategyData = {
  strategy: {
    name: { ar: "الخطة الاستراتيجية ٢٠٢٤–٢٠٢٦", en: "Strategic Plan 2024–2026" },
    startYear: 2024,
    endYear: 2026,
  },

  perspectives: [
    {
      id: "p-beneficiaries",
      name: { ar: "المؤمن عليهم والمتقاعدون", en: "Insured & Pensioners" },
      description: { ar: "", en: "" },
      weight: 40,
      icon: "users",
    },
    {
      id: "p-financial",
      name: { ar: "الاستدامة المالية", en: "Financial Sustainability" },
      description: { ar: "", en: "" },
      weight: 30,
      icon: "wallet",
    },
    {
      id: "p-processes",
      name: { ar: "العمليات الداخلية", en: "Internal Processes" },
      description: { ar: "", en: "" },
      weight: 30,
      icon: "workflow",
    },
  ],

  objectives: [
    {
      id: "o-coverage",
      perspectiveId: "p-beneficiaries",
      name: { ar: "توسيع مظلة الشمول", en: "Extend coverage" },
      description: { ar: "", en: "" },
      owner: "إدارة الشمول",
      weight: 60,
    },
    {
      id: "o-satisfaction",
      perspectiveId: "p-beneficiaries",
      name: { ar: "رفع رضا متلقي الخدمة", en: "Raise beneficiary satisfaction" },
      description: { ar: "", en: "" },
      owner: "إدارة خدمة الجمهور",
      weight: 40,
    },
    {
      id: "o-collection",
      perspectiveId: "p-financial",
      name: { ar: "رفع كفاءة تحصيل الاشتراكات", en: "Improve contribution collection" },
      description: { ar: "", en: "" },
      owner: "إدارة التحصيل",
      weight: 100,
    },
    {
      id: "o-digital",
      perspectiveId: "p-processes",
      name: { ar: "التحول الرقمي للخدمات", en: "Digitise services" },
      description: { ar: "", en: "" },
      owner: "إدارة تكنولوجيا المعلومات",
      weight: 100,
    },
  ],

  kpis: [
    {
      id: "k-coverage",
      objectiveId: "o-coverage",
      name: { ar: "نسبة المشمولين من القوى العاملة", en: "Workforce coverage rate" },
      unit: "%",
      frequency: "yearly",
      direction: "higher",
      baseline: 68,
      weight: 100,
      yearly: {
        2024: { target: 70, actual: 71 },
        2025: { target: 73, actual: 72 },
        2026: { target: 76, actual: null },
      },
    },
    {
      id: "k-csat",
      objectiveId: "o-satisfaction",
      name: { ar: "مؤشر رضا متلقي الخدمة", en: "Customer satisfaction index" },
      unit: "%",
      frequency: "yearly",
      direction: "higher",
      baseline: 75,
      weight: 100,
      yearly: {
        2024: { target: 78, actual: 79 },
        2025: { target: 82, actual: 80 },
        2026: { target: 85, actual: null },
      },
    },
    {
      id: "k-collection",
      objectiveId: "o-collection",
      name: { ar: "نسبة تحصيل الاشتراكات", en: "Contribution collection rate" },
      unit: "%",
      frequency: "yearly",
      direction: "higher",
      baseline: 85,
      weight: 100,
      yearly: {
        2024: { target: 88, actual: 87 },
        2025: { target: 91, actual: 88 },
        2026: { target: 94, actual: null },
      },
    },
    {
      id: "k-eservices",
      objectiveId: "o-digital",
      name: { ar: "نسبة الخدمات الإلكترونية", en: "Share of services online" },
      unit: "%",
      frequency: "yearly",
      direction: "higher",
      baseline: 60,
      weight: 100,
      yearly: {
        2024: { target: 70, actual: 72 },
        2025: { target: 80, actual: 81 },
        2026: { target: 90, actual: null },
      },
    },
  ],

  initiatives: [
    {
      id: "i-informal",
      objectiveId: "o-coverage",
      name: { ar: "شمول العاملين في القطاع غير المنظم", en: "Informal sector inclusion" },
      owner: "إدارة الشمول",
      status: "inProgress",
      weight: 60,
      yearly: {
        2024: { weight: 30, achievement: 100 },
        2025: { weight: 30, achievement: 80 },
        2026: { weight: 40, achievement: null },
      },
    },
    {
      id: "i-expats",
      objectiveId: "o-coverage",
      name: { ar: "التواصل مع المغتربين", en: "Outreach to expatriates" },
      owner: "إدارة الاتصال",
      status: "inProgress",
      weight: 40,
      yearly: {
        2024: { weight: 0, achievement: null },
        2025: { weight: 50, achievement: 90 },
        2026: { weight: 50, achievement: null },
      },
    },
    {
      id: "i-service-cards",
      objectiveId: "o-satisfaction",
      name: { ar: "تحديث بطاقات تقديم الخدمة", en: "Refresh service cards" },
      owner: "إدارة خدمة الجمهور",
      status: "completed",
      weight: 100,
      yearly: {
        2024: { weight: 50, achievement: 100 },
        2025: { weight: 50, achievement: 100 },
        2026: { weight: 0, achievement: null },
      },
    },
    {
      id: "i-auto-collection",
      objectiveId: "o-collection",
      name: { ar: "أتمتة التحصيل والربط مع البنوك", en: "Automate collection" },
      owner: "إدارة التحصيل",
      status: "onHold",
      weight: 100,
      yearly: {
        2024: { weight: 40, achievement: 60 },
        2025: { weight: 40, achievement: 40 },
        2026: { weight: 20, achievement: null },
      },
    },
    {
      id: "i-platform",
      objectiveId: "o-digital",
      name: { ar: "تطوير منصة الخدمات الإلكترونية", en: "E-services platform" },
      owner: "إدارة تكنولوجيا المعلومات",
      status: "inProgress",
      weight: 100,
      yearly: {
        2024: { weight: 30, achievement: 100 },
        2025: { weight: 40, achievement: 75 },
        2026: { weight: 30, achievement: null },
      },
    },
  ],
};
