# PlateIQ — Stitch UI integration notes

This update integrates the Stitch design language into the existing Next.js application without replacing the shared demo model or operational handlers.

## Changes made

- Added `app/stitch-integrated.css` and loaded it last in `app/layout.tsx` so the Stitch-inspired sage background, kitchen-green accents, compact sidebar, cards, tables, settings layout, and responsive styles are applied to the actual React pages.
- Reworked sidebar navigation into the same groups shown in the Stitch references: Core Operations, Intelligence & Planning, AI Assistant & Strategy, and System.
- Kept the sidebar independently scrollable and fixed the responsive drawer/backdrop behavior while preserving page scrolling.
- Expanded Kitchen Settings with a Brigade Access & Roles panel and applied the Stitch settings visual treatment.
- Updated the browser theme color to match the integrated light-sage workspace.
- Kept the existing React routes, local demo state, simulation, inventory actions, waste recording, ticket progression, forecasting, and notifications in place.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Validation note

The source files were checked with the globally available TypeScript compiler. A full typecheck/build could not be completed in this environment because dependencies were not installed and the package registry was unreachable; the resulting TypeScript output was dominated by missing dependency/type declarations. Run `npm install` locally before validating with `npm run build` and `npm test`.

No deployment, GitHub push, backend, API, authentication, database, or business-logic changes were made.
