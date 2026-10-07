# Contributing to Widget Dashboard

Thanks for taking the time to contribute! This guide covers how to get the
project running locally and what we look for in a pull request.

By participating, you agree to follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Ways to contribute

- **Report a bug.** Open an issue using the bug report template, with steps
  to reproduce and your VS Code version.
- **Suggest a widget or feature.** Open a feature request and describe the
  problem it solves.
- **Send a pull request.** For anything bigger than a small fix, please open an
  issue first so we can agree on the approach before you put in the work.

Issues labeled
[`good first issue`](https://github.com/SoohumKaushik/vscode-widget-dashboard/labels/good%20first%20issue)
are a good place to start.

## Development setup

Requirements: [Node.js](https://nodejs.org/) 20+ and VS Code 1.85+.

```bash
git clone https://github.com/SoohumKaushik/vscode-widget-dashboard.git
cd vscode-widget-dashboard
npm install
```

| Command | What it does |
| --- | --- |
| `npm run build` | One-off build of the extension and webview into `dist/` |
| `npm run watch` | Rebuild on every change |
| `npm run compile` | Type-check with `tsc` (no output) |
| `npm run package` | Build a `.vsix` you can install locally |
| `npm run icon` | Regenerate the Marketplace icon PNG from the SVG |

### Running the extension

1. Open the repo in VS Code.
2. Press `F5`. This starts `npm run watch` and opens an **Extension Development
   Host** window with the extension loaded.
3. Click the **Widget Dashboard** icon in that window's Activity Bar.
4. After editing code, run **Developer: Reload Webviews** (or reload the window
   with `Cmd/Ctrl+R`) in the Extension Development Host to see your changes.

To debug the dashboard UI, run **Developer: Open Webview Developer Tools** in
the Extension Development Host.

## Project structure

```
src/
  extension/
    extension.ts     # Extension host: view provider, saved state, GitHub auth,
                     # and network requests the webview can't make itself
  webview/           # React dashboard UI (bundled to dist/webview.js)
    components/
      Dashboard.tsx  # Layout, edit mode, drag-to-reorder, widget gallery
    widgets/         # One file per widget
    styles.ts        # All CSS, injected at startup
resources/           # Activity-bar and Marketplace icons
scripts/             # Build helpers (icon generator)
```

The webview and the extension host talk through `postMessage`. A widget that
needs network access or secrets sends a message such as `fetchStockData`, and
`extension.ts` does the request and posts the result back. This keeps tokens
out of the webview and avoids CORS limits.

## Adding a widget

1. Create `src/webview/widgets/YourWidget.tsx` and export a React component.
   Give its root element the `widget` class plus your own, e.g.
   `className="widget your-widget"`.
2. Register it in `src/webview/components/Dashboard.tsx`: add a `case` to
   `renderWidget` and an entry to the gallery.
3. Add styles to `src/webview/styles.ts`. Prefer VS Code theme variables
   (`var(--vscode-...)`) where they fit.
4. If the widget calls a new host, do the request in `extension.ts` and list
   the host under **Privacy & network access** in the README.
5. Add the widget to the README's widget table.

Widgets should work in a narrow sidebar (about 250px wide) up to the
dashboard's maximum column width (520px).

## Pull request checklist

- [ ] `npm run compile` and `npm run build` pass. CI runs both on every PR.
- [ ] You tried the change in the Extension Development Host, ideally at both a
      narrow and a wide sidebar width.
- [ ] UI changes include a screenshot or GIF in the PR description.
- [ ] No new network hosts, telemetry, or OAuth scopes without discussion in an
      issue first.
- [ ] README and CHANGELOG are updated if users will notice the change.

Keep pull requests focused: one feature or fix per PR is much easier to review.
Match the style of the surrounding code (4-space indentation, functional React
components with hooks).

## Releasing (maintainers)

Releases are published by `.github/workflows/release.yml` when a version tag is
pushed:

1. Bump `version` in `package.json` (`npm version <x.y.z> --no-git-tag-version`)
   and add a section to `CHANGELOG.md`.
2. Merge to `main`.
3. `git tag vX.Y.Z && git push origin vX.Y.Z`

The workflow checks that the tag matches `package.json`, type-checks, publishes
to the Marketplace using the `VSCE_PAT` secret, and attaches the `.vsix` to a
GitHub Release.

## License

By contributing, you agree that your contributions will be licensed under the
[MIT License](./LICENSE).
