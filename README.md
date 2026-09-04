# Digital Forensics Platform — Frontend

Dashboard for the
[`digital-forensics-platform_backend`](https://github.com/MergenUchiha/digital-forensics-platform_backend)
API: cases, evidence with chain of custody, an investigation timeline,
analytics, and PDF case reports.

## Stack

| | |
|---|---|
| Framework | React 18 + TypeScript, Vite 5 |
| Routing | react-router-dom 7 |
| Styling | Tailwind CSS 3, light and dark themes |
| Charts | Recharts, react-simple-maps |
| Motion | framer-motion |
| HTTP | axios with a shared interceptor |
| PDF | jsPDF + jspdf-autotable |
| i18n | English, Russian, Turkmen |

## Getting started

The backend must be running first — see its README.

```bash
bun install            # or npm install
cp .env.example .env
npm run dev            # http://localhost:3000
```

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5001/api` | REST API, including the `/api` prefix |

The dev server binds 3000 and the preview server 5173, both with
`strictPort`; those are the two origins the backend allows through
`CORS_ORIGINS` by default.

## Pages

| Route | What it shows |
|---|---|
| `/` | Case, evidence and event counts, an event chart by severity, recent timeline activity, and a world map of case locations |
| `/cases` | Case list with a status filter, and case creation |
| `/cases/:id` | One case: details, evidence, timeline, chain of custody, analysis |
| `/evidence` | Evidence across visible cases, filtered by case, type and IoT device, with upload |
| `/timeline` | Events filtered by case and severity |
| `/reports` | Generate a PDF report for a case |
| `/settings` | Profile, password, notification preferences, language, theme |

## Authentication

Sign in with an account an administrator created; registration is closed on
the server. The token goes into `localStorage` and is attached as a bearer
header by the axios interceptor. A 401 clears it and returns to the login
screen.

What a role can do is enforced by the API. An analyst sees the cases they
opened and the ones assigned to them; an administrator sees everything and is
the only one who can delete a case, a piece of evidence or a timeline event.
The UI shows the same pages to both and surfaces the error when an action is
refused.

## Layout

```
src/
├── services/          one file per API area, all through the axios instance
│   └── api.ts         interceptors, ApiError, handleApiError
├── contexts/          auth, language and theme providers
├── locales/           en, ru, tk
├── components/
│   ├── layout/        Sidebar, Header (search, notifications, new case)
│   ├── dashboard/     StatCard, ThreatChart, ActivityFeed, WorldMap
│   ├── cases/         CaseCard, CreateCaseModal
│   ├── evidence/      EvidenceCard
│   ├── timeline/      Timeline
│   └── ui/            Button, Card, Badge, Modal, Input, FileUpload,
│                      SearchBar, Notification, ConfirmDialog
├── hooks/useApi.ts    useApi, useMutation, useQuery
├── utils/             formatting, class merging, PDF export
└── types/             domain types and request payloads
```

## Scripts

```bash
npm run dev       # dev server on 3000
npm run build     # tsc && vite build
npm run preview   # serve the production build on 5173
npm run lint      # ESLint
```

## Known limitations

* **No tests.** Correctness was checked by building, linting and running the
  app against a live API.
* **Search is client-side.** The header search fetches the caller's cases and
  evidence and filters them in the browser; the API has no search endpoint,
  so it does not scale past a few hundred records.
* **The world map loads its topology from a CDN** (`world-atlas` on jsDelivr),
  so the map needs network access beyond the API.
* **Reports are remembered in `localStorage`.** The PDF is generated in the
  browser and nothing is stored server-side, so the report list is per-browser
  and disappears when site data is cleared.
* **Most of the Settings page is browser-local.** Only the display name and
  the password reach the server.
* **The token lives in `localStorage`,** so any script running on the page can
  read it. Moving it to an httpOnly cookie needs the backend to set one.
* **Network analysis is not implemented.** The page existed as a fully
  commented-out file rendering fictional nodes; it was removed rather than
  left as a dead route.

## Licence

MIT
