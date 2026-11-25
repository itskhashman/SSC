import type { ReactNode } from "react";

/** Olive-green title band, echoing the SSC main navigation bar. */
export default function PageTitle({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-primary px-5 py-4 text-primary-foreground shadow-sm animate-in fade-in slide-in-from-top-2 fill-mode-both duration-500 ease-out md:px-7">
      <div>
        <h1 className="text-xl font-bold md:text-2xl">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-primary-foreground/80">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
