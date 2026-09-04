# CLAUDE.md — Conoce tu Vehículo RD

Project-specific application of the developer's global architecture/workflow rules. Where this
file is silent, the global `CLAUDE.md` still applies. Where they conflict, this file wins for
this repo — it reflects the actual state of the codebase, not an idealized one.

---

## 0. Ownership & code style

- All code belongs to the developer. No AI branding, signatures, or "Co-Authored-By" in code,
  commits, or docs.
- Self-explanatory code, no comments unless the WHY is genuinely non-obvious (existing files
  have some — don't strip them as a side effect of unrelated edits; don't add new ones).
- TypeScript for all new frontend AND backend code — `server/` was migrated from plain JS to
  TS (see §1).
- No parallel/background agents unless explicitly requested.

---

## 1. Actual architecture (not the aspirational one)

This is **not yet** a full three-tier app. Be precise about what exists:

- **Frontend** — `src/`, React 19 + Vite + TypeScript, SPA. All domain logic lives in
  `src/core/` (pure TS, no React/DOM — must stay portable to a future Expo app per PLAN.md).
  `src/data/` is a curated static catalog, `src/storage/` is a repository-pattern wrapper over
  `localStorage`.
- **Backend** — `server/src/`, TypeScript, Controller-Service structured:
  `controllers/welcomeEmailController.ts` handles HTTP request/response only; the business
  logic lives in `services/googleAuthService.ts` (verifies a Google OAuth access token) and
  `services/emailService.ts` (sends the welcome email via Nodemailer/Gmail). `app.ts` wires
  routes to controllers and takes config as a plain object (no reading `process.env` outside
  `index.ts`, which stays the only place secrets are read from the environment). Compiled with
  `npm run build` (`tsc`, NodeNext ESM) into `server/dist/`, run with `npm start`
  (`node dist/index.js`); `npm run dev` runs it directly via `tsx watch`. When this grows past
  one route, add new controllers/services alongside the existing ones — don't fold logic back
  into `app.ts` or `index.ts`.
- **No database.** All vehicle/history state is `localStorage` on the client (see MVP.md §"El
  MVP en el localStorage"-equivalent decisions). §7 of the global CLAUDE.md (object storage,
  MongoDB vs SQL) does not apply until a real backing store is introduced — don't add one
  speculatively.
- **Deployment** — `render.yaml` defines two Render services: the static frontend build and the
  `server/` API, wired together via `VITE_API_BASE_URL`. Secrets (`GOOGLE_CLIENT_ID`,
  `GMAIL_USER`, `GMAIL_APP_PASSWORD`) are `sync: false` env vars on Render, never hardcoded —
  keep it that way.
- **AI/LLM usage — none at runtime yet.** MVP.md §4 deliberately pre-generates vehicle
  descriptions as static data instead of calling an LLM per-request (no cost, no latency, works
  offline). The "Mecánico Virtual" (Fase 2, chat-based) is the first feature that will need a
  live Claude call — when that's built, the call **must** go through `server/`, never
  client-side, and the rule "AI never invents maintenance numbers, only explains" (PLAN.md §4.2)
  is a product invariant, not a suggestion.

---

## 2. Design-first

`DESIGN.md` (repo root) is the design system: racing visual identity (black/red/carbon fiber),
color tokens with verified WCAG AA contrast ratios, typography rule (Rajdhani for headings only,
system font for body), component patterns, and formal `--space-*` / `--text-*` scales (base-8
spacing with a 4px half-step; a fixed set of font sizes — no more `12.5px`-style decimals). Read
it before touching any UI file, and use its scale tokens rather than a literal px value for any
new `padding`/`margin`/`gap`/`font-size` — the only exception is decorative geometry tied to a
specific element's own math (documented case-by-case in DESIGN.md §2).

---

## 3. Branching

`main` had uncommitted work sitting directly on it before this file existed — moved to
`feature/racing-visual-redesign`. Going forward: every non-trivial change gets a
`feature/`/`fix/` branch, committed incrementally, PR'd — never direct commits to `main`.

---

## 4. Terminal commands (verified against package.json)

```bash
npm install       # deps
npm run dev       # vite dev server (hot reload)
npm test          # vitest run — 6 tests in src/core/maintenance/engine.test.ts
npm run test:watch
npm run lint      # oxlint (not ESLint/Prettier — see hooks below)
npm run build     # tsc -b && vite build
npm run preview   # preview the production build
```

No Playwright/e2e suite exists yet. No `server/` test script exists yet.

`server/` has its own commands (run from `server/`, not the repo root):

```bash
npm install       # deps (incl. TypeScript, tsx, @types/*)
npm run dev       # tsx watch src/index.ts — hot-reloading dev server
npm run build     # tsc — compiles src/ to dist/
npm start         # node dist/index.js — what Render actually runs
```

---

## 5. Hooks actually configured

`.claude/settings.json` in this repo wires:
- **post-edit**: `npm run lint` and `npm test` after edits to files under `src/`, so a broken
  test or lint violation surfaces immediately instead of at commit time.
- **pre-commit**: lint + test, matching global rule §11.

There is no secrets scanner (Gitleaks/Trufflehog) wired in yet — `.env` files are gitignored
(verified in `.gitignore`), which is the current safety net.

---

## 6. Closed gaps (were flagged, now resolved)

These were the three template gaps this project started with. All three are done as of the
racing visual redesign session — recorded here so the reasoning behind each isn't lost:

1. **Emoji as icons — closed.** `AppShell` tabs, TopBar icons, section headers, and small UI
   badges/checkmarks now use `lucide-react` (see DESIGN.md §5). `src/data/specs/` keeps its
   emoji — that's editorial content voice in curated advisory copy, not navigation iconography,
   and was deliberately excluded from this migration.
2. **Base-8 spacing / typography scale — closed.** Formalized in `src/ui/tokens.css` as
   `--space-*` / `--text-*` and documented in DESIGN.md §2. Applied across every component and
   screen CSS module; decorative element-specific geometry (timeline dot offsets, WCAG 44px tap
   targets, etc.) was deliberately left as literal px — see DESIGN.md §2's exception.
3. **`server/` Controller-Service split + TypeScript — closed.** See §1.

---

## 7. Project Baseline

- **Current status:** Frontend builds and runs clean (`npm run build`, `npm test` both green,
  6/6 tests passing). `server/` compiles clean (`npm run build` in `server/`) and was smoke-
  tested directly against the compiled `dist/index.js` (missing-token 400, invalid-token 401
  both verified).
- **Verified features:** MVP M0–M5 complete (onboarding, profile, maintenance engine, history,
  responsive/WCAG AA polish) per README.md/MVP.md. Google Sign-In + welcome-email backend added
  after the MVP docs were written (not yet reflected in PLAN.md/MVP.md — those docs describe a
  no-accounts MVP; the code has since added auth). Visual identity relaunched to racing
  black/red/carbon-fiber theme, documented in DESIGN.md, including a formal spacing/typography
  scale and an icon-library migration (§6).
- **Session objective:** _(update per session)_
