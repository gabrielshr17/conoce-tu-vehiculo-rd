# Tasks — Gran Turismo redesign

Branch `feature/gt-redesign` · PR [#3](https://github.com/gabrielshr17/conoce-tu-vehiculo-rd/pull/3) (draft)
Last updated: 2026-09-29 · Build ✅ · Lint ✅ · Unit 25/25 ✅ · E2E 6/6 ✅ · axe 0 violations ✅

---

## ✅ Done

### Design system
- [x] Adopt `design.pen` as the design source (slate/red palette, Space Grotesk / Outfit / Inter)
- [x] Fix the pen's failing contrast (white on red, red text, grey labels, 9px text)
- [x] Radius scale and new tokens (`--rojo-relleno`, `--sobre-rojo`, `--gris-tenue`, `--amarillo-suave`, …)
- [x] Remove carbon fiber; update favicon, theme color and meta description
- [x] Load only the font weights in use; buttons use the Outfit label face
- [x] Rewrite `DESIGN.md`; update `CLAUDE.md`

### Navigation / shell
- [x] Four tabs: Vehículo, Servicios, Historial, Consejos
- [x] Floating tab bar on mobile, sidebar from 768px
- [x] Tabs open at the top of the page
- [x] Per-screen browser titles
- [x] Installable on the home screen (manifest + icons)

### Screens
- [x] **Welcome** — studio-lit car reveal, neutral Google button, clearer account-help link
- [x] **Onboarding** — auto-advance on selection, pinned buttons, summary of choices
- [x] **Vehículo (Perfil)** — status pill, hero card, real metrics, next services, key specs
- [x] **Vehículo** — "Cambiar de vehículo"; status pill and service rows open Servicios
- [x] **Servicios (Mantenimiento)** — status summary, filters, Editar km, redesigned cards
- [x] **Servicios** — undo toast after "Marcar hecho"
- [x] **Servicios** — calmer first-time notice, compact "estimado" note, RD tips in amber
- [x] **Historial** — redesign, inline field errors, confirm before delete
- [x] **Consejos** — new screen (care tips, performance, accessories, communities)

### Business rules (in `src/core`, test-first)
- [x] `summarizeRecommendations` — overall status and counts
- [x] `date` helpers — dates stay on the local calendar day
- [x] `validateHistoryDraft` — required fields, no future dates, no negative amounts
- [x] `validateOdometer` — odometer can't go below a recorded service
- [x] `resolveVehicleSelection` — correcting a car keeps history, switching cars starts fresh

### Bugs fixed
- [x] Entries on the 1st of a month showed under the previous month (UTC−4)
- [x] Marking a service done after 8pm saved tomorrow's date
- [x] Odometer could be set below recorded mileage
- [x] Historial accepted invalid input and failed silently
- [x] A new car inherited the previous car's history and km
- [x] Stale filter left an empty list with nothing selected
- [x] "Al día" badge on services that were never recorded (now "Más adelante")
- [x] Undo toast closed early when the same service was marked twice
- [x] Tabs kept the previous page's scroll position

### Accessibility
- [x] `<main>` landmark, one `<h1>` per screen, correct heading order
- [x] Labels linked to inputs; `aria-invalid` / `aria-describedby` on errors
- [x] Unique names for each "Marcar hecho" button
- [x] External-link cue on community links
- [x] Reduced-motion support; 44–48px touch targets

### Testing & docs
- [x] Playwright e2e suite (`npm run test:e2e`) — 6 main flows
- [x] `CHANGELOG.md` created and kept current under `[Unreleased]`
- [x] Screenshots at 375px / 1440px in `docs/screenshots/gt-redesign/`
- [x] PR description with screenshots and test steps
- [x] `design.pen` tracked; `generated.png` gitignored (third-party photo)
- [x] Removed unused `Card` and `ComingSoon` components

---

## ⬜ Not done

### Needs your decision or action
- [ ] Review PR #3 and mark it ready (40 commits — squash merge)
- [ ] Decide what happens to an old car's history after switching cars (keep for switching back, or purge)
- [ ] Decide how `design.pen` should handle its missing reference photo (`generated.png` is gitignored)

### Can be done next
- [ ] Run the e2e suite in the pre-commit hook and/or CI
- [ ] Offline support (service worker) so the installed app opens without a connection
- [ ] Update `PLAN.md` / `MVP.md` (they still describe the pre-login, pre-redesign MVP)
- [ ] Narrower sidebar or icon rail at tablet width (768–1023px)
- [ ] Validate on staging before proposing production
