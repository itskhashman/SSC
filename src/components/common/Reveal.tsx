import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ENTER_UP, staggerDelay } from "@/lib/motion";

export default function Reveal({
  index = 0,
  className,
  children,
}: {
  index?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn(ENTER_UP, className)} style={staggerDelay(index)}>
      {children}
    </div>
  );
}
