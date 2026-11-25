import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

/** `/` → default locale (Arabic) dashboard. basePath is added by Next. */
export default function RootPage() {
  redirect(`/${routing.defaultLocale}/dashboard`);
}
