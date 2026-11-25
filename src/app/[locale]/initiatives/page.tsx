import { setRequestLocale } from "next-intl/server";
import InitiativesView from "@/components/initiatives/InitiativesView";

export default async function InitiativesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <InitiativesView />;
}
