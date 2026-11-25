import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** White card with the gold top strip used across the SSC website. */
export default function GoldCard({
  children,
  className,
  bodyClassName,
}: {
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl bg-card text-card-foreground shadow-sm ring-1 ring-foreground/5",
        className,
      )}
    >
      <div className="gold-bar h-2" />
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </div>
  );
}
