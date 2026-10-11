# PlateIQ

**AI-assisted restaurant operations and food intelligence dashboard.**

PlateIQ is a web application concept for helping restaurant teams bring daily kitchen operations into one place—from demand forecasting and inventory to food waste tracking and operational insights.

> **Project status:** Active development. The current frontend still uses demo/mock data in parts of the experience while backend integration is being developed. Check the implementation before treating any forecast, metric, or action as production data.

## What it aims to support

- **Overview** — a central view of restaurant operations.
- **Live Operations** — kitchen activity and operational status.
- **Demand Forecasting** — forecast-oriented views to support preparation planning.
- **Inventory** — stock visibility and inventory workflows.
- **Waste Management** — tracking and reviewing food waste.
- **External Factors / What-If** — exploring scenarios that may affect demand.
- **AI Copilot** — a conversational interface for operational assistance.
- **Insights and Settings** — analysis and application configuration.

Feature availability and data behavior may vary while development and backend integration continue.

## Built with

- **Next.js** and **React**
- **TypeScript**
- **Tailwind CSS**
- **Recharts** for charts and data visualization
- **Vitest** for tests

## Run locally

### Prerequisites

- Node.js compatible with the installed Next.js version
- pnpm (the repository declares pnpm as its package manager)

### Install dependencies

```bash
pnpm install
```

### Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Run tests

```bash
pnpm test
```

### Create a production build

```bash
pnpm build
```

## Backend integration

The frontend/backend contract and expected API endpoints are documented in [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md).

To point the frontend at a separately hosted backend, configure `NEXT_PUBLIC_PLATEIQ_API_URL` as described in that document. Do not commit real credentials or private environment files.

## Repository structure

- `app/` — Next.js routes, layouts, and styles
- `components/` — reusable UI components and application views
- `lib/` — shared types, API contracts, and client utilities
- `backend/` and `plateiq-ml/` — backend and machine-learning-related project code
- `tests/` — automated tests

## Development notes

- Verify whether a feature is connected to the backend before relying on its data.
- Keep secrets in local environment variables, never in source control.
- Update this README as features move from mock data to working backend integration.

---

Built as a restaurant operations and food intelligence project.
