# 🚀 Quick Start Guide

## Get Up and Running in 2 Minutes!

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build the Extension
```bash
npm run build
```

### Step 3: Test in VS Code
1. Press `F5` (or Run > Start Debugging)
2. A new VS Code window will open with your extension loaded
3. Look for the Widget Dashboard icon in the Activity Bar (left sidebar)
4. Click it to open your dashboard!

### Step 4: Explore
- See the Clock widget showing live time ⏰
- Read a coding quote in the Welcome widget 👋
- Click "Edit" to enter edit mode
- Click "+ Add Widget" to add more widgets
- Hover over widgets to see the smooth animations ✨

## Development Workflow

### Watch Mode (Recommended)
```bash
npm run watch
```
This will automatically rebuild when you make changes.

### Making Changes
1. Edit files in `src/`
2. Save the file
3. In the Extension Development Host window:
   - Press `Cmd+R` (Mac) or `Ctrl+R` (Windows/Linux) to reload
4. See your changes!

## Project Structure (Quick Reference)

```
src/
├── extension/          # VS Code extension code
│   ├── extension.ts    # Main entry point
│   └── DashboardPanel.ts
│
└── webview/           # React UI
    ├── index.tsx      # React entry
    ├── App.tsx        # Main app
    ├── styles.ts      # All CSS styles
    ├── components/
    │   └── Dashboard.tsx
    └── widgets/
        ├── ClockWidget.tsx
        └── WelcomeWidget.tsx
```

## Adding a New Widget

### 1. Create the Widget Component
Create `src/webview/widgets/MyWidget.tsx`:

```tsx
import React from 'react';

export const MyWidget: React.FC = () => {
    return (
        <div className="widget my-widget">
            <div className="widget-content">
                <h2>My Widget</h2>
                <p>Hello from my widget!</p>
            </div>
        </div>
    );
};
```

### 2. Add Styles
Add to `src/webview/styles.ts`:

```css
.my-widget {
    background: linear-gradient(135deg, #34C759 0%, #5AC8FA 100%);
    color: white;
    min-height: 180px;
}
```

### 3. Register in Dashboard
Edit `src/webview/components/Dashboard.tsx`:

```tsx
import { MyWidget } from '../widgets/MyWidget';

// In renderWidget function:
case 'mywidget':
    return <MyWidget key={widget.id} />;

// In the JSX:
<div className="widget-container">
    <MyWidget />
</div>
```

### 4. Rebuild and Test
```bash
npm run build
```
Then reload the Extension Development Host (`Cmd+R` / `Ctrl+R`)

## Common Tasks

### Change Colors
Edit the gradient in `src/webview/styles.ts`:
```css
.clock-widget {
    background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}
```

### Change Widget Size
Modify `min-height` in the widget's CSS class.

### Add Animation
Use CSS transitions or keyframe animations in `styles.ts`.

## Troubleshooting

### Extension doesn't load
- Check Debug Console for errors
- Make sure you ran `npm install` and `npm run build`
- Try closing and reopening the Extension Development Host

### Widgets don't appear
- Open Developer Tools: Help > Toggle Developer Tools
- Check Console for React errors
- Make sure `dist/webview.js` exists

### Changes don't show up
- Make sure you rebuilt: `npm run build`
- Reload the Extension Development Host: `Cmd+R` / `Ctrl+R`
- If using watch mode, check terminal for build errors

## Next Steps

1. ✅ Get it running (you're here!)
2. 📝 Read `PROJECT_SUMMARY.md` for architecture overview
3. 🎨 Read `SHOWCASE.md` for design details
4. 🧪 Read `TESTING.md` for testing guide
5. 🚀 Start building your own widgets!

## Need Help?

- Check the [VS Code Extension API docs](https://code.visualstudio.com/api)
- Look at the existing widgets for examples
- Read the comments in the code

---

**Happy coding! 🎉**

