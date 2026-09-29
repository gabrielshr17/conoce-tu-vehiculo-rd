# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- New **Consejos** tab with care tips, performance tips, recommended accessories and owner
  communities for your vehicle.
- Overall vehicle status (Al día / Pronto / Atención) at the top of the Vehículo screen and a
  status summary on Servicios.
- Filter services by priority (Todos / Urgente / Pronto / Más adelante).
- Update your odometer at any time with **Editar km** on Servicios.
- Vehículo screen now previews your next two services, with a link to see them all.
- **Deshacer** after marking a service done, in case of a mis-tap.
- Change your vehicle from the Vehículo screen. Fixing the year or version keeps your history
  and odometer; switching to a different car starts fresh.
- Tap the status pill or an upcoming service on Vehículo to open Servicios.
- Add the app to your phone's home screen.
- Historial asks before deleting a record and explains what to fix when a field is invalid.

### Changed

- New visual design: dark slate and racing red, new typography, and a floating tab bar on
  phones.
- Tabs renamed to Vehículo, Servicios, Historial and Consejos.
- Sign out moved to the top of the Vehículo screen on phones (still in the sidebar on desktop).
- Services that are not due yet are labelled "Más adelante".
- Welcome screen redesigned; the account link now clearly refers to your Google account.
- Onboarding moves to the next step as soon as you pick an option, and the buttons stay
  within reach.
- Dominican tips on service cards are shown in amber instead of red.
- Each screen has its own browser tab title, and switching tabs starts at the top.

### Fixed

- Services dated on the 1st of a month were shown under the previous month, and marking a
  service done late at night recorded the next day's date.
- The odometer can no longer be set below a mileage already recorded in Historial.
- Future dates and negative amounts are no longer accepted in Historial.
