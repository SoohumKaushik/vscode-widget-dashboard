# Widget Dashboard for VS Code

A beautiful, customizable iOS-style widget dashboard for Visual Studio Code. Personalize your coding environment with widgets just like your iPhone home screen!

## Features

- 🎨 **Beautiful iOS-inspired design** - Glassmorphism effects, smooth animations, and Apple's design language
- 📱 **Customizable widgets** - Add, remove, and arrange widgets to your liking
- ⏰ **Built-in widgets**:
  - Clock widget with live time and date
  - Welcome widget with coding quotes
  - More widgets coming soon!
- 🌓 **Dark mode support** - Automatically adapts to your VS Code theme
- ✨ **Smooth animations** - iOS-style transitions and effects

## Installation

### For Development

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the extension
4. Press `F5` to open a new VS Code window with the extension loaded
5. Open the Widget Dashboard from the activity bar (left sidebar)

## Usage

1. Click the Widget Dashboard icon in the activity bar
2. Click "Edit" to enter edit mode
3. Click "+ Add Widget" to add new widgets
4. Click "Done" when finished editing

## Development

### Project Structure

```
vscode-widget-dashboard/
├── src/
│   ├── extension/          # VS Code extension code
│   │   ├── extension.ts    # Main extension entry point
│   │   └── DashboardPanel.ts
│   ├── webview/            # React UI code
│   │   ├── components/     # React components
│   │   ├── widgets/        # Widget implementations
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── styles.ts       # Global styles
│   └── types/              # TypeScript types
├── resources/              # Icons and assets
├── dist/                   # Compiled output
└── package.json
```

### Building

- `npm run build` - Build the extension once
- `npm run watch` - Watch for changes and rebuild automatically

### Creating New Widgets

To create a new widget:

1. Create a new file in `src/webview/widgets/YourWidget.tsx`
2. Export a React component
3. Add styling using className (styles are in `src/webview/styles.ts`)
4. Register the widget in `Dashboard.tsx`

## Roadmap

- [ ] Drag-and-drop widget repositioning
- [ ] Widget size customization (small, medium, large)
- [ ] More built-in widgets:
  - [ ] Pomodoro timer
  - [ ] GitHub activity feed
  - [ ] Ambient music player
  - [ ] Weather widget
  - [ ] Stock ticker
  - [ ] Sports scores
  - [ ] Calendar/events
- [ ] Widget marketplace
- [ ] Custom widget API for third-party developers
- [ ] Widget settings and configuration
- [ ] Export/import dashboard layouts

## Technologies

- **TypeScript** - Type-safe development
- **React** - UI framework
- **VS Code Extension API** - Integration with VS Code
- **esbuild** - Fast bundling

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

