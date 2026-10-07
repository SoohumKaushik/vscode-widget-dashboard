# Changelog

All notable changes to this extension are documented here. This project
follows [Semantic Versioning](https://semver.org/).

## [1.2.0] - Unreleased

### Changed
- Widgets now stack in a single column that stays centered at a readable width,
  even when the sidebar is dragged wide or the view is moved into the panel.
- Edit mode is simpler: drag widgets to reorder them, or remove them with the
  red ×. The S / M / L / ↔ / ↕ size buttons and the per-widget size toggle are
  gone because they had little or no effect on the layout.
- Markets: crypto now shows the 24-hour change, matching exchanges and Yahoo
  Finance's quote pages, instead of the change since midnight UTC.
- Markets: sparklines cover the whole trading day (or the last 24 hours for
  crypto), with a dashed line at the previous close.
- Markets: shows "US market closed" outside trading hours and keeps the last
  quotes on screen if a refresh fails.
- Sports, Markets, and GitHub cards use the same rounded card style as the
  other widgets.

### Fixed
- Ethereum was labeled with a Bitcoin (₿) symbol.
- The Markets preview in the widget gallery showed made-up prices.
- Network requests now time out after 10 seconds instead of leaving a widget
  stuck on "Loading…".

## [1.1.0] - 2026-09-15

### Changed
- The Markets widget shows real quotes from Yahoo Finance instead of
  simulated prices.
- The GitHub widget requests only the `read:user` and `notifications` scopes,
  and the access token is no longer sent to the webview.
- "Open Widget Dashboard" focuses the sidebar view, and "Add Widget" opens its
  gallery.

### Fixed
- The Activity Bar icon rendered as a solid gray square.
- Added a proper Marketplace icon.

## 1.0.1 and earlier

- Early releases. See the git history for details.
