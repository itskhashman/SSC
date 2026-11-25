import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** White card with the gold top strip used across the SSC website. */
export default function GoldCard({
  children,
  className,
  bodyClassName,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  /** Lift and deepen the shadow on hover (for clickable cards). */
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl bg-card text-card-foreground shadow-sm ring-1 ring-foreground/5 transition-[box-shadow,translate] duration-200 ease-out",
        interactive && "hover:-translate-y-1 hover:shadow-lg motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <div className="gold-bar h-2" />
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </div>
  );
}
