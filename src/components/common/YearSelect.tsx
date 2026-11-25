"use client";

import { CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSelectedYear, useStrategyYears } from "@/hooks/useStrategy";
import { useStrategyStore } from "@/store/strategyStore";
import { useUiStore } from "@/store/uiStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** Year filter for the green title band. Hidden until data and strategy exist. */
export default function YearSelect() {
  const t = useTranslations("common");
  const hydrated = useStrategyStore((s) => s.hydrated);
  const years = useStrategyYears();
  const year = useSelectedYear();
  const selectYear = useUiStore((s) => s.selectYear);

  if (!hydrated || years.length === 0) return null;

  const items = years.map((y) => ({ value: String(y), label: String(y) }));

  return (
    <div className="flex items-center gap-2 text-sm">
      <CalendarDays className="size-4 text-gold-light" />
      <span className="text-primary-foreground/80">{t("year")}</span>
      <Select
        items={items}
        value={String(year)}
        onValueChange={(value) => value && selectYear(Number(value))}
      >
        <SelectTrigger
          aria-label={t("year")}
          className="min-w-24 border-white/30 bg-white/10 text-primary-foreground hover:bg-white/20 dark:bg-white/10 [&_svg]:text-primary-foreground/80!"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
