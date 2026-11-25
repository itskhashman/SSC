# SSC Strategy Management

Balanced Scorecard tool (perspectives → objectives → KPIs and initiatives) for
the Social Security Corporation. It has a dashboard and a management page, works
in Arabic and English, and has light and dark themes. Data is saved in the
browser's localStorage.

## Run locally

Requires Node 26 (`nvm use`).

```bash
npm install
npm run dev
```

Open http://localhost:3000/SSC/. It redirects to the Arabic dashboard.

## Build

`npm run build` writes the static site to `out/`. Pushing to `main` deploys it
to GitHub Pages through `.github/workflows/deploy.yml`.

See `CLAUDE.md` for architecture and conventions.
