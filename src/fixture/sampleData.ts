import type { StrategyData } from "@/domain/strategy";

/**
 * Small illustrative plan (2024–2026). Loaded on a first visit and by the
 * "Load sample data" button on the empty-state card.
 */
export const SAMPLE_DATA: StrategyData = {
  strategy: {
    name: { ar: "الخطة الاستراتيجية ٢٠٢٤–٢٠٢٦", en: "Strategic Plan 2024–2026" },
    startYear: 2024,
    endYear: 2026,
  },

  objectives: [
    {
      id: "o-coverage",
      name: { ar: "توسيع مظلة الشمول", en: "Extend coverage" },
      description: { ar: "", en: "" },
      owner: "إدارة الشمول",
      weight: 30,
    },
    {
      id: "o-satisfaction",
      name: { ar: "رفع رضا متلقي الخدمة", en: "Raise beneficiary satisfaction" },
      description: { ar: "", en: "" },
      owner: "إدارة خدمة الجمهور",
      weight: 20,
    },
    {
      id: "o-collection",
      name: { ar: "رفع كفاءة تحصيل الاشتراكات", en: "Improve contribution collection" },
      description: { ar: "", en: "" },
      owner: "إدارة التحصيل",
      weight: 25,
    },
    {
      id: "o-digital",
      name: { ar: "التحول الرقمي للخدمات", en: "Digitise services" },
      description: { ar: "", en: "" },
      owner: "إدارة تكنولوجيا المعلومات",
      weight: 25,
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
      weight: 50,
      yearly: {
        2024: { weight: 50, achievement: 100 },
        2025: { weight: 50, achievement: 100 },
        2026: { weight: 0, achievement: null },
      },
    },
    {
      id: "i-branches",
      objectiveId: "o-satisfaction",
      name: { ar: "خدمة المؤمن عليهم قرب أماكن سكنهم", en: "Serve insured persons near home" },
      owner: "إدارة الفروع",
      status: "inProgress",
      weight: 50,
      yearly: {
        2024: { weight: 20, achievement: 100 },
        2025: { weight: 40, achievement: 70 },
        2026: { weight: 40, achievement: null },
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
      weight: 70,
      yearly: {
        2024: { weight: 30, achievement: 100 },
        2025: { weight: 40, achievement: 75 },
        2026: { weight: 30, achievement: null },
      },
    },
    {
      id: "i-assistant",
      objectiveId: "o-digital",
      name: { ar: "المساعد الافتراضي", en: "Virtual assistant" },
      owner: "إدارة تكنولوجيا المعلومات",
      status: "notStarted",
      weight: 30,
      yearly: {
        2024: { weight: 0, achievement: null },
        2025: { weight: 0, achievement: null },
        2026: { weight: 100, achievement: null },
      },
    },
  ],
};
