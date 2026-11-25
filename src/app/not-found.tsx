import "./globals.css";
import Link from "next/link";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { routing } from "@/i18n/routing";

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});

/**
 * Shown for URLs outside any locale (e.g. a path missing `/SSC/ar/`).
 * The root layout only passes children through, so this page renders
 * its own <html> and <body>.
 */
export default function RootNotFound() {
  return (
    <html lang="ar" dir="rtl" className={plexArabic.variable}>
      <body className="flex min-h-svh items-center justify-center p-6">
        <div className="w-full max-w-md overflow-hidden rounded-xl bg-card text-center shadow-sm ring-1 ring-foreground/5">
          <div className="gold-bar h-2" />
          <div className="space-y-4 p-8">
            <p className="text-5xl font-bold text-gold">٤٠٤</p>
            <h1 className="text-xl font-semibold">الصفحة غير موجودة</h1>
            <p className="text-sm text-muted-foreground" dir="ltr">
              Page not found
            </p>
            {/* next/link adds the /SSC basePath. */}
            <Link
              href={`/${routing.defaultLocale}/dashboard/`}
              className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              الانتقال إلى لوحة المؤشرات
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
