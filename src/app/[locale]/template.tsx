import type { ReactNode } from "react";

/**
 * A template re-mounts on every navigation (unlike a layout), so this
 * fade plays each time the page changes. The sidebar and top bars live in
 * the layout and stay put.
 */
export default function LocaleTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-1 fill-mode-both duration-300 ease-out">
      {children}
    </div>
  );
}
