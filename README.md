# Widget Dashboard for VS Code

A beautiful, customizable iOS-style widget dashboard for Visual Studio Code.
Personalize your editor with widgets — just like your iPhone home screen.

Open it from the **Widget Dashboard** icon in the Activity Bar (left sidebar).

## Features

- 🎨 **iOS-inspired design** — glassmorphism, smooth animations, adapts to your VS Code theme
- 🧩 **Customizable layout** — add, remove, drag-to-reorder, and resize widgets (S / M / L / Wide / Tall)
- 💾 **Persistent** — your layout and notes are saved between sessions

## Built-in widgets

| Widget | What it does |
| --- | --- |
| ⏰ **Clock** | Live time and date |
| 👋 **Welcome** | Greeting with a rotating coding quote |
| 📝 **Quick Notes** | A scratchpad that auto-saves as you type |
| 🎵 **Ambient Sounds** | Rain, ocean, fireplace, forest, and wind loops with a volume control |
| 🏈 **Live Sports** | Live NFL and NBA scores (via ESPN) |
| 📈 **Markets** | Live stock and crypto quotes with sparklines (via Yahoo Finance) |
| 🐙 **GitHub Activity** | Your notifications, pull requests, and assigned issues |

## Usage

1. Click the **Widget Dashboard** icon in the Activity Bar.
2. Click **Add Widget** to open the gallery and pick a widget.
3. Click **Edit** to drag widgets around, resize them, or remove them, then **Done**.

The **GitHub Activity** widget asks you to sign in with GitHub the first time.
It uses the least-privilege `read:user` and `notifications` scopes; your access
token stays inside the extension host and is never exposed to the dashboard UI.

## Privacy & network access

This extension only talks to:

- `site.api.espn.com` — public sports scores (Live Sports widget)
- `query1.finance.yahoo.com` — public market quotes (Markets widget)
- `api.github.com` — your GitHub activity, only after you sign in (GitHub widget)
- `assets.mixkit.co` — ambient sound files (Ambient Sounds widget)

No analytics, no tracking, no data leaves your machine beyond these requests.

## Development

```bash
npm install
npm run build      # one-off build
npm run watch      # rebuild on change
npm run icon       # regenerate the marketplace icon PNG
```

Press `F5` in VS Code to launch an Extension Development Host with the extension loaded.

### Project structure

```
src/
  extension/     # VS Code extension host (auth, network, state)
  webview/       # React dashboard UI
    components/  # Dashboard shell
    widgets/     # Individual widgets
resources/       # Icons
scripts/         # Build helpers (icon generator)
```

### Adding a widget

1. Create `src/webview/widgets/YourWidget.tsx` and export a React component.
2. Register it in `src/webview/components/Dashboard.tsx` (the `renderWidget`
   switch and the gallery grid).
3. Style it via `className` (styles live in `src/webview/styles.ts`).

## Roadmap

- [ ] Pomodoro timer widget
- [ ] Weather widget
- [ ] Calendar / events widget
- [ ] Per-widget settings
- [ ] Export / import dashboard layouts

## License

MIT — see [LICENSE](./LICENSE).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
