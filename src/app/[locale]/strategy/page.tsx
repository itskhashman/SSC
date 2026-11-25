import { setRequestLocale } from "next-intl/server";
import StrategyView from "@/components/strategy/StrategyView";

export default async function StrategyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <StrategyView />;
}
