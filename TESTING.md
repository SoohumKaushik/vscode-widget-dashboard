# Testing the Widget Dashboard Extension

## How to Test

1. **Open the project in VS Code**
   ```bash
   code .
   ```

2. **Press F5** to launch the Extension Development Host
   - This will open a new VS Code window with your extension loaded

3. **Open the Widget Dashboard**
   - Look for the Widget Dashboard icon in the Activity Bar (left sidebar)
   - Click on it to open the dashboard panel

4. **Test the features**
   - ✅ Clock widget should show current time updating every second
   - ✅ Welcome widget should show a greeting and random quote
   - ✅ Click "Edit" button to enter edit mode
   - ✅ Click "+ Add Widget" to add new widgets
   - ✅ Hover over widgets to see the lift effect
   - ✅ Test in both light and dark themes

## Expected Behavior

### Clock Widget
- Displays current time in HH:MM:SS format
- Shows current day and date
- Beautiful gradient background (blue to purple)
- Time updates every second
- Colon blinks every second

### Welcome Widget
- Shows time-based greeting (Good Morning/Afternoon/Evening)
- Displays a random coding quote
- Beautiful gradient background (orange to pink)
- Quote has a frosted glass effect

### Dashboard
- Clean, iOS-inspired design
- Smooth animations when widgets appear
- Hover effects on buttons and widgets
- Edit mode for managing widgets
- Responsive grid layout

## Troubleshooting

If the extension doesn't load:
1. Check the Debug Console for errors
2. Make sure you ran `npm install` and `npm run build`
3. Try reloading the Extension Development Host window

If widgets don't appear:
1. Check the browser console in the webview (Help > Toggle Developer Tools)
2. Make sure the dist folder contains webview.js and extension.js

## Next Steps

After testing, you can:
1. Add more widgets
2. Implement drag-and-drop
3. Add widget settings
4. Create a widget marketplace
5. Package and publish the extension

