# Gran Turismo redesign — session recap (2026-09-28 → 2026-09-29)

Branch: `feature/gt-redesign` · PR: [#3](https://github.com/gabrielshr17/conoce-tu-vehiculo-rd/pull/3) (draft)
Status at end of session: `npm run build`, `npm run lint`, `npm test` all green — **25/25 tests**.
axe-core (WCAG 2.1 AA + best practices): **0 violations** on every screen at 375px and 1440px.

---

## Done

### Round 1 — adopt `design.pen`

- [x] New design system from `design.pen`: slate/red palette, Space Grotesk / Outfit / Inter,
      radius scale, WCAG AA corrections (`--rojo-relleno`, `--rojo-brillante`, `--gris-tenue`).
- [x] Four-tab shell (Vehículo / Servicios / Historial / Consejos), floating tab bar on mobile,
      sidebar from 768px.
- [x] Perfil rebuilt (status pill, hero card, real metrics, next services, key specs).
- [x] Mantenimiento rebuilt (status summary, Editar km, filters, redesigned service cards).
- [x] New `/consejos` screen (tips, accessories, communities moved from Perfil).
- [x] `summarizeRecommendations` in core (TDD).
- [x] Review fixes: stale filter falls back to Todos; `later` labelled "Más adelante".
- [x] `DESIGN.md`, `CLAUDE.md`, `CHANGELOG.md`, screenshots in `docs/screenshots/gt-redesign/`,
      `design.pen` tracked, `generated.png` gitignored.

### Round 2 — autonomous improvements (27 commits after `979fb9e`)

**Bugs fixed**
- [x] Dates shifted one day/month in UTC−4 (history grouping, engine month math, "Marcar hecho"
      after 8pm) — new `src/core/date.ts`.
- [x] Odometer could be set below a recorded service — `validateOdometer` in core.
- [x] Historial accepted future dates / negative amounts and failed silently —
      `validateHistoryDraft` in core with inline, field-level errors.
- [x] Switching to a different car inherited the old car's history and km —
      `resolveVehicleSelection` in core (found in code review).
- [x] Undo toast closed early when the same service was marked twice (found in code review).
- [x] Tabs kept the previous page's scroll position.

**UX**
- [x] Welcome redesigned (studio-lit silhouette, neutral Google button, clearer account link).
- [x] Historial redesigned; delete now asks for confirmation; form scrolls into view.
- [x] Undo toast after "Marcar hecho".
- [x] Onboarding auto-advances on selection, navigation pinned, choices summarized.
- [x] "Cambiar de vehículo" from Perfil (pre-filled onboarding, back returns to Perfil).
- [x] Status pill and upcoming-service rows open Servicios.
- [x] First-time estimate notice is neutral info with a link; odometer prompt says where to look.
- [x] Compact "Estimado, sin registro previo" note instead of a repeated sentence.
- [x] RD tips in amber (red reserved for urgency); neutral accessory chips.
- [x] Installable: web manifest + home-screen icons; favicon and theme color updated.

**Accessibility / quality**
- [x] `<main>` landmark, one `<h1>` per screen, correct heading order.
- [x] Labels linked to inputs, `aria-invalid` + `aria-describedby` on errors.
- [x] Unique names for each "Marcar hecho" button; external-link cue on community links.
- [x] Reduced-motion support; buttons center icons and have 48px min height.
- [x] Per-screen document titles.
- [x] Only the font weights actually used are loaded.

---

## Pending / suggested follow-ups

- [ ] **Delete unused components** `src/ui/components/ComingSoon.tsx` and `Card.tsx` (+ CSS) — not
      imported anywhere; left in place because deleting files needs your confirmation.
- [ ] **Refresh PR screenshots** — `docs/screenshots/gt-redesign/` predates round 2 (Welcome,
      Historial, onboarding and card changes are not shown).
- [ ] **Mark PR #3 ready for review** once you've looked through it (it is large: ~34 commits;
      consider squash-merging as the CLAUDE.md rules say).
- [ ] **Offline support** — the manifest makes the app installable, but there's no service worker,
      so it still needs a connection to load.
- [ ] **Orphaned history** — when switching cars, the old car's records stay in `localStorage`
      under its old id (harmless, invisible). Decide whether to keep (for switching back) or purge.
- [ ] **Playwright e2e suite** — flows verified this session with throwaway scripts (onboarding,
      change vehicle, undo, delete confirm, validation errors, scroll reset). Worth turning into
      a real `e2e/` suite; none exists yet.
- [ ] **PLAN.md / MVP.md** still describe the pre-auth, pre-redesign MVP.
- [ ] **Hardcoded white on red** (`#fff` in Button / filters / Guardar) could become a token.
- [ ] **Tablet (768px)**: the 240px sidebar is wide for that width; an icon rail could free space.
- [ ] `design.pen` references `generated.png`, which is gitignored — the pen shows a missing
      image in that frame for anyone cloning the repo.
