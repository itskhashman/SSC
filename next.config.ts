import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Must match NEXT_PUBLIC_BASE_PATH in .env (the GitHub Pages repo name).
const BASE_PATH = "/SSC";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages: no server, middleware or API routes.
  output: "export",
  trailingSlash: true,
  basePath: BASE_PATH,
  images: { unoptimized: true },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
