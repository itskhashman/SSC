import type { ReactNode } from "react";

/**
 * Root layout. `<html>` and `<body>` live in `[locale]/layout.tsx`, because
 * `lang` and `dir` depend on the locale segment.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
