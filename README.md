# TMAG Support Console

The Support Console is a SvelteKit operations app for TMAG support and technical administration. It provides authenticated access to customer, company, plan, billing, request, analytics, and technical maintenance workflows.

## Stack

- SvelteKit 2 + Svelte 5
- TypeScript
- Vite
- Tailwind CSS 4
- TanStack Svelte Query
- Axios
- Lucide Svelte

Svelte runes mode is enabled for project files in `svelte.config.js`.

## Local URL

The Vite config serves the app on port `3003` and host `0.0.0.0`:

```text
http://localhost:3003
```

SSR and prerendering are disabled in `src/routes/+layout.ts`.

## Setup

```bash
cd support
bun install
```

Create a local `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_API_KEY=<same-value-as-backend-APP_API_KEY>
```

Do not commit `.env` files or real secrets.

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the SvelteKit development server on port `3003`. |
| `bun run build` | Create the production build. |
| `bun run preview` | Preview the production build locally. |
| `bun run check` | Run SvelteKit sync and `svelte-check`. |
| `bun run check:watch` | Run Svelte checks in watch mode. |
| `bun run prepare` | Run `svelte-kit sync` for generated types. |

## Main route areas

- `/login` support login.
- `/dashboard` support overview.
- `/users` and `/users/[id]/*` user records, credits, health profile, and plans.
- `/company` and `/company/[id]/*` company records, team, plans, reports, settings, and credit requests.
- `/plans` and `/plans/[id]` travel plan review.
- `/requests` operational request queue.
- `/billing/*` credits, ebooks, invoices, ledger, pricing, and exchange rates.
- `/analytics` support analytics.
- `/technical/*` admin users, AI logs, abuse, blog, company registrations, contacts, countries, ebooks, FAQ, logs, plan contexts, roles, and system pages.

## Project structure

```text
support/
├── src/
│   ├── lib/
│   │   ├── api/          # Axios client and domain API modules
│   │   ├── components/   # Layout, data, and UI components
│   │   ├── guards/       # Route/access guard helpers
│   │   ├── stores/       # Auth and sidebar stores
│   │   └── utils/        # Utility functions
│   ├── routes/           # SvelteKit routes and app shell
│   ├── app.css
│   ├── app.d.ts
│   └── app.html
├── package.json
├── svelte.config.js
└── vite.config.ts
```

## API integration

- API base defaults to `http://localhost:8080/api/v1`.
- Requests send `X-Api-Key: VITE_API_KEY`.
- Auth stores the JWT in the `support_access_token` cookie and attaches it as `Authorization: Bearer <token>`.
- `401` or `403` responses clear local auth state and redirect to `/login`.

## Development workflow

1. Start `spring-server` on port `8080` with a matching `APP_API_KEY`.
2. Ensure CORS includes `http://localhost:3003`.
3. Start this app with `bun run dev`.
4. Validate changes with `bun run check` and `bun run build`.
