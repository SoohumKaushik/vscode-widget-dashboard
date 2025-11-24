export const globalStyles = `
/* Apple-inspired Design System */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text',
                 'Helvetica Neue', Arial, sans-serif;
    background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
    color: #ffffff;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.dashboard {
    padding: 16px;
    width: 100%;
    box-sizing: border-box;
}

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--vscode-panel-border);
}

.dashboard-title {
    font-size: clamp(20px, 5vw, 32px);
    font-weight: 700;
    letter-spacing: -0.5px;
}

.dashboard-actions {
    display: flex;
    gap: 12px;
}

.action-button {
    padding: clamp(6px, 2vw, 8px) clamp(10px, 3vw, 16px);
    border-radius: 12px;
    font-size: clamp(11px, 2.5vw, 14px);
    font-weight: 600;
    background: var(--vscode-button-secondaryBackground);
    color: var(--vscode-button-secondaryForeground);
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
}

.action-button .btn-icon {
    font-size: clamp(12px, 3vw, 16px);
}

.action-button .btn-text {
    display: inline;
}

.action-button:hover {
    background: var(--vscode-button-secondaryHoverBackground);
    transform: translateY(-1px);
}

.action-button.primary {
    background: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
}

.action-button.primary:hover {
    background: var(--vscode-button-hoverBackground);
}

@media (max-width: 400px) {
    .action-button {
        padding: 6px 10px;
        font-size: 11px;
        gap: 3px;
    }

    .action-button .btn-text {
        display: none;
    }

    .action-button .btn-icon {
        font-size: 14px;
    }
}

/* Widget Gallery Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 999;
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.widget-gallery {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(20, 20, 20, 0.98);
    backdrop-filter: blur(40px);
    -webkit-backdrop-filter: blur(40px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    padding: 24px;
    width: 95%;
    max-width: 900px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
    z-index: 1000;
    animation: gallerySlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes gallerySlideIn {
    from {
        opacity: 0;
        transform: translate(-50%, -48%) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}

.gallery-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
}

.gallery-header h2 {
    font-size: clamp(16px, 4vw, 20px);
    font-weight: 700;
    margin: 0;
    color: white;
}

.modal-close {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: white;
    font-size: 20px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.modal-close:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 16px;
    overflow-y: auto;
    overflow-x: hidden;
    flex: 1;
    padding-right: 8px;
    margin-right: -8px;
}

@media (max-width: 900px) {
    .gallery-grid {
        grid-template-columns: 1fr;
    }
}

/* Custom scrollbar for gallery */
.gallery-grid::-webkit-scrollbar {
    width: 6px;
}

.gallery-grid::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
}

.gallery-grid::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
}

.gallery-grid::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
}

.gallery-item {
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 16px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    min-height: 200px;
    display: flex;
    flex-direction: column;
}

.gallery-item:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.gallery-item:active {
    transform: translateY(0) scale(0.98);
}

.gallery-item-label {
    padding: 12px 16px;
    background: rgba(0, 0, 0, 0.3);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    font-size: clamp(13px, 3vw, 15px);
    font-weight: 600;
    color: white;
    text-align: center;
}

.gallery-preview-mini {
    padding: 16px;
    pointer-events: none;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.preview-mini-content {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 16px;
    font-size: clamp(10px, 2vw, 12px);
    width: 100%;
    transform: scale(0.85);
}

.preview-header {
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 8px;
    color: white;
}

.preview-textarea {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    height: 40px;
    margin-bottom: 6px;
}

.preview-footer {
    font-size: 9px;
    opacity: 0.6;
    text-align: right;
    color: white;
}

.preview-buttons {
    display: flex;
    gap: 6px;
}

.preview-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 14px;
    flex: 1;
    text-align: center;
}

.preview-sport-tabs {
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
}

.preview-tab {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    padding: 4px 8px;
    font-size: 9px;
    flex: 1;
    text-align: center;
    color: white;
}

.preview-game {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    padding: 8px;
}

.preview-team {
    font-size: 9px;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
}

.gallery-name {
    padding: 14px 16px;
    font-size: clamp(13px, 3vw, 15px);
    font-weight: 600;
    color: white;
    background: rgba(0, 0, 0, 0.3);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;
}

.widget-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
    grid-auto-rows: 200px;
    gap: 16px;
    padding: 16px;
    width: 100%;
    /* Remove dense packing to prevent overlaps */
    grid-auto-flow: row;
    /* Ensure grid can accommodate all widget sizes */
    min-height: min-content;
    /* Default to 2 columns, will be updated by JS */
    --grid-columns: 2;
}

/* Widget Sizes for Bento Grid */
.widget-size-small {
    grid-column: span 1;
    grid-row: span 1;
    /* Prevent overflow */
    max-width: 100%;
    overflow: hidden;
    contain: layout style paint;
}

.widget-size-medium {
    grid-column: span 1;
    grid-row: span 2;
    max-width: 100%;
    overflow: hidden;
    contain: layout style paint;
}

.widget-size-large {
    /* Limit to available columns, max 2 */
    grid-column: span clamp(1, 2, var(--grid-columns, 2));
    grid-row: span 2;
    max-width: 100%;
    overflow: hidden;
    contain: layout style paint;
}

.widget-size-wide {
    /* Limit to available columns, max 2 */
    grid-column: span clamp(1, 2, var(--grid-columns, 2));
    grid-row: span 1;
    max-width: 100%;
    overflow: hidden;
    contain: layout style paint;
}

.widget-size-tall {
    grid-column: span 1;
    grid-row: span 3;
    max-width: 100%;
    overflow: hidden;
    contain: layout style paint;
}

/* Prevent grid blowout - ensure widgets never exceed grid bounds */
.widget-container {
    min-width: 0;
    min-height: 0;
    box-sizing: border-box;
}

/* Drag and Drop States */
.widget-container.dragging {
    opacity: 0.5;
    cursor: grabbing;
}

.widget-container.drag-over {
    border: 2px dashed rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.05);
}

.edit-mode .widget-container {
    cursor: grab;
}

.edit-mode .widget-container:active {
    cursor: grabbing;
}

/* Widget Size Controls */
.widget-size-controls {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 4px;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    padding: 6px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    z-index: 10;
}

.size-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.size-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
}

.size-btn.active {
    background: rgba(59, 130, 246, 0.8);
    border-color: rgba(59, 130, 246, 1);
    box-shadow: 0 0 12px rgba(59, 130, 246, 0.5);
}

/* Responsive breakpoints for different sidebar widths */

/* Very narrow sidebar (< 300px) - Single column, compact */
@media (max-width: 300px) {
    .widget-grid {
        grid-template-columns: 1fr;
        grid-auto-rows: auto;
        gap: 8px;
        padding: 8px;
        --grid-columns: 1;
    }

    .dashboard {
        padding: 6px;
    }

    .dashboard-title {
        font-size: 16px;
    }

    .dashboard-header {
        margin-bottom: 8px;
        padding-bottom: 6px;
    }

    /* Force all widgets to single column */
    .widget-size-small,
    .widget-size-medium,
    .widget-size-large,
    .widget-size-wide,
    .widget-size-tall {
        grid-column: 1 / -1 !important;
        grid-row: auto !important;
        min-height: 180px;
    }
}

/* Narrow sidebar (300px - 400px) - Single column */
@media (min-width: 301px) and (max-width: 400px) {
    .widget-grid {
        grid-template-columns: 1fr;
        grid-auto-rows: auto;
        gap: 10px;
        padding: 10px;
        --grid-columns: 1;
    }

    .dashboard {
        padding: 8px;
    }

    .dashboard-title {
        font-size: 18px;
    }

    .dashboard-header {
        margin-bottom: 10px;
        padding-bottom: 8px;
    }

    /* Force all widgets to single column */
    .widget-size-small,
    .widget-size-medium,
    .widget-size-large,
    .widget-size-wide,
    .widget-size-tall {
        grid-column: 1 / -1 !important;
        grid-row: auto !important;
        min-height: 200px;
    }
}

/* Medium-narrow sidebar (401px - 500px) - Single column, more breathing room */
@media (min-width: 401px) and (max-width: 500px) {
    .widget-grid {
        grid-template-columns: 1fr;
        grid-auto-rows: auto;
        gap: 12px;
        padding: 12px;
        --grid-columns: 1;
    }

    /* Force all widgets to single column */
    .widget-size-small,
    .widget-size-medium,
    .widget-size-large,
    .widget-size-wide,
    .widget-size-tall {
        grid-column: 1 / -1 !important;
        grid-row: auto !important;
    }

    .widget-size-small {
        min-height: 180px;
    }

    .widget-size-medium,
    .widget-size-tall {
        min-height: 250px;
    }

    .widget-size-large,
    .widget-size-wide {
        min-height: 220px;
    }
}

/* Medium sidebar (501px - 650px) - Can fit 2 small widgets side by side */
@media (min-width: 501px) and (max-width: 650px) {
    .widget-grid {
        grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr));
        grid-auto-rows: 180px;
        gap: 12px;
        --grid-columns: 2;
    }

    /* Allow 2-column spans only if grid has 2+ columns */
    .widget-size-small {
        grid-column: span 1;
        grid-row: span 1;
    }

    .widget-size-medium {
        grid-column: span 1;
        grid-row: span 2;
    }

    .widget-size-large {
        grid-column: span min(2, var(--grid-columns, 2));
        grid-row: span 2;
    }

    .widget-size-wide {
        grid-column: span min(2, var(--grid-columns, 2));
        grid-row: span 1;
    }

    .widget-size-tall {
        grid-column: span 1;
        grid-row: span 2;
    }
}

/* Medium-wide sidebar (651px - 800px) - 2 columns comfortable */
@media (min-width: 651px) and (max-width: 800px) {
    .widget-grid {
        grid-template-columns: repeat(auto-fill, minmax(min(100%, 250px), 1fr));
        grid-auto-rows: 200px;
        gap: 14px;
        --grid-columns: 2;
    }

    .widget-size-small {
        grid-column: span 1;
        grid-row: span 1;
    }

    .widget-size-medium {
        grid-column: span 1;
        grid-row: span 2;
    }

    .widget-size-large {
        grid-column: span min(2, var(--grid-columns, 2));
        grid-row: span 2;
    }

    .widget-size-wide {
        grid-column: span min(2, var(--grid-columns, 2));
        grid-row: span 1;
    }

    .widget-size-tall {
        grid-column: span 1;
        grid-row: span 2;
    }
}

/* Wide sidebar (801px+) - Full bento grid layout */
@media (min-width: 801px) {
    .widget-grid {
        grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
        grid-auto-rows: 200px;
        gap: 16px;
        --grid-columns: 3;
    }

    .widget-size-small {
        grid-column: span 1;
        grid-row: span 1;
    }

    .widget-size-medium {
        grid-column: span 1;
        grid-row: span 2;
    }

    .widget-size-large {
        grid-column: span min(2, var(--grid-columns, 2));
        grid-row: span 2;
    }

    .widget-size-wide {
        grid-column: span min(2, var(--grid-columns, 2));
        grid-row: span 1;
    }

    .widget-size-tall {
        grid-column: span 1;
        grid-row: span 3;
    }
}

.widget-container {
    position: relative;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.widget {
    background: var(--vscode-editor-background);
    border: 1px solid var(--vscode-panel-border);
    border-radius: 16px;
    padding: 12px;
    min-height: 150px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    transition: all 0.2s ease;
    box-sizing: border-box;
    width: 100%;
    word-wrap: break-word;
}

@media (max-width: 400px) {
    .widget {
        padding: 10px;
        border-radius: 12px;
    }
}

.widget:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.widget-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* Clock Widget */
.clock-widget {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    min-height: 180px;
    padding: 12px;
}

.clock-time {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 4px;
    margin-bottom: 8px;
}

.time-digit {
    font-size: clamp(32px, 10vw, 56px);
    font-weight: 700;
    letter-spacing: -2px;
    line-height: 1;
    font-variant-numeric: tabular-nums;
}

.time-separator {
    font-size: clamp(32px, 10vw, 56px);
    font-weight: 300;
    opacity: 0.8;
    animation: blink 1s ease-in-out infinite;
}

@keyframes blink {
    0%, 49% { opacity: 0.8; }
    50%, 100% { opacity: 0.2; }
}

.time-seconds {
    font-size: clamp(16px, 4vw, 24px);
    font-weight: 500;
    opacity: 0.7;
    margin-left: 4px;
}

.clock-date {
    text-align: center;
    font-size: clamp(12px, 3vw, 16px);
    font-weight: 500;
    opacity: 0.9;
    letter-spacing: 0.3px;
}

/* Welcome Widget */
.welcome-widget {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    min-height: 180px;
    padding: 12px;
}

.welcome-greeting {
    font-size: clamp(20px, 6vw, 32px);
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: -0.5px;
    word-wrap: break-word;
}

.welcome-quote {
    font-size: clamp(11px, 2.5vw, 14px);
    font-weight: 400;
    line-height: 1.5;
    opacity: 0.9;
    font-style: italic;
    padding: 10px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    word-wrap: break-word;
}

.remove-widget-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #FF3B30;
    color: white;
    font-size: 18px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    z-index: 10;
}

.remove-widget-btn:hover {
    transform: scale(1.1);
    background: #CC0000;
}

/* Quick Notes Widget */
.quick-notes-widget {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    min-height: 250px;
    padding: 12px;
}

.notes-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    gap: 8px;
    flex-wrap: wrap;
}

.notes-title {
    font-size: clamp(14px, 3.5vw, 18px);
    font-weight: 600;
    margin: 0;
}

.char-count {
    font-size: clamp(10px, 2.5vw, 12px);
    opacity: 0.7;
    font-weight: 500;
}

.notes-textarea {
    width: 100%;
    min-height: 160px;
    background: rgba(255, 255, 255, 0.15);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 10px;
    color: white;
    font-size: clamp(12px, 2.8vw, 14px);
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
    resize: vertical;
    transition: all 0.2s ease;
    line-height: 1.6;
    box-sizing: border-box;
}

.notes-textarea::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.notes-textarea:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.notes-footer {
    margin-top: 8px;
    display: flex;
    justify-content: flex-end;
}

.auto-save-indicator {
    font-size: 12px;
    opacity: 0.8;
    font-weight: 500;
}

/* Ambient Music Widget */
.ambient-music-widget {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    min-height: 280px;
    padding: 12px;
}

.ambient-header {
    margin-bottom: 12px;
}

.ambient-title {
    font-size: clamp(14px, 3.5vw, 18px);
    font-weight: 600;
    margin: 0;
}

.sound-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    margin-bottom: 12px;
}

@media (max-width: 400px) {
    .sound-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
    }
}

.sound-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    padding: 10px 6px;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    min-width: 0;
}

.sound-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
}

.sound-btn.active {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
}

.sound-emoji {
    font-size: clamp(18px, 4vw, 24px);
}

.sound-name {
    font-size: clamp(9px, 2.2vw, 11px);
    font-weight: 500;
    opacity: 0.9;
    text-align: center;
    word-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
}

.player-controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.play-pause-btn {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    width: clamp(40px, 10vw, 48px);
    height: clamp(40px, 10vw, 48px);
    font-size: clamp(16px, 4vw, 20px);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
}

.play-pause-btn:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
}

.volume-control {
    display: flex;
    align-items: center;
    gap: 6px;
}

.volume-icon {
    font-size: clamp(12px, 3vw, 16px);
    flex-shrink: 0;
}

.volume-slider {
    flex: 1;
    height: 4px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.2);
    outline: none;
    -webkit-appearance: none;
}

.volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
}

.volume-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
}

.volume-slider::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    border: none;
}

.volume-value {
    font-size: clamp(10px, 2.5vw, 12px);
    opacity: 0.7;
    min-width: clamp(25px, 7vw, 35px);
    text-align: right;
    flex-shrink: 0;
}

/* Custom scrollbar - iOS style */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
}

/* Firefox scrollbar */
* {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

/* Live Sports Widget */
.live-sports-widget {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    min-height: 300px;
    padding: 12px;
    transition: all 0.3s ease;
}

.live-sports-widget.size-compact {
    min-height: 200px;
}

.live-sports-widget.size-normal {
    min-height: 300px;
}

.live-sports-widget.size-expanded {
    min-height: 400px;
}

.sports-header {
    margin-bottom: 12px;
}

.sports-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.sports-title {
    font-size: clamp(14px, 3.5vw, 18px);
    font-weight: 600;
    margin: 0;
}

.sports-controls {
    display: flex;
    gap: 6px;
    align-items: center;
}

.size-toggle-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    width: clamp(28px, 7vw, 32px);
    height: clamp(28px, 7vw, 32px);
    font-size: clamp(14px, 3.5vw, 16px);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
}

.size-toggle-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
}

.size-toggle-btn:active {
    transform: scale(0.95);
}

.refresh-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    width: clamp(28px, 7vw, 32px);
    height: clamp(28px, 7vw, 32px);
    font-size: clamp(14px, 3.5vw, 16px);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
}

.refresh-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
}

.refresh-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.refresh-btn.spinning {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.last-update {
    font-size: clamp(9px, 2vw, 10px);
    opacity: 0.6;
    text-align: center;
    margin-top: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.league-selector {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
}

.league-btn {
    flex: 1;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    padding: 8px 12px;
    color: white;
    font-size: clamp(11px, 2.5vw, 13px);
    cursor: pointer;
    transition: all 0.2s ease;
}

.league-btn:hover {
    background: rgba(255, 255, 255, 0.15);
}

.league-btn.active {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
}

.games-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
    transition: max-height 0.3s ease;
    padding-right: 4px;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.games-container::-webkit-scrollbar {
    width: 6px;
}

.games-container::-webkit-scrollbar-track {
    background: transparent;
}

.games-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
}

.games-container::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.4);
}

.size-compact .games-container {
    max-height: 180px;
}

.size-normal .games-container {
    max-height: 320px;
}

.size-expanded .games-container {
    max-height: 600px;
}

.game-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 10px;
}

.game-status {
    font-size: clamp(10px, 2.2vw, 11px);
    opacity: 0.7;
    text-align: center;
    margin-bottom: 8px;
    font-weight: 500;
}

.team-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
}

.team-info {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
}

.team-logo {
    width: clamp(20px, 5vw, 24px);
    height: clamp(20px, 5vw, 24px);
    object-fit: contain;
}

.team-name {
    font-size: clamp(12px, 3vw, 14px);
    font-weight: 600;
}

.team-score {
    font-size: clamp(14px, 3.5vw, 18px);
    font-weight: 700;
    min-width: 30px;
    text-align: right;
}

.loading-text, .error-text, .no-games-text {
    text-align: center;
    padding: 20px;
    font-size: clamp(12px, 3vw, 14px);
    opacity: 0.7;
    word-wrap: break-word;
}

.error-text {
    color: #ff6b6b;
}

/* Stock Market Widget */
.stock-market-widget {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    min-height: 300px;
    padding: 12px;
}

.stock-header {
    margin-bottom: 12px;
}

.stock-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.stock-title {
    font-size: clamp(14px, 3.5vw, 18px);
    font-weight: 600;
    margin: 0;
}

.stock-controls {
    display: flex;
    gap: 8px;
    align-items: center;
}

.stocks-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 4px;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
    transition: max-height 0.3s ease;
}

.size-compact .stocks-container {
    max-height: 180px;
}

.size-normal .stocks-container {
    max-height: 320px;
}

.size-expanded .stocks-container {
    max-height: 600px;
}

.stocks-container::-webkit-scrollbar {
    width: 6px;
}

.stocks-container::-webkit-scrollbar-track {
    background: transparent;
}

.stocks-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
}

.stocks-container::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.4);
}

.stock-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s ease;
}

.stock-card:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
}

.stock-info {
    flex: 1;
}

.stock-name-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
}

.stock-symbol {
    font-size: clamp(11px, 2.5vw, 13px);
    font-weight: 700;
    color: white;
}

.stock-name {
    font-size: clamp(10px, 2.2vw, 11px);
    opacity: 0.6;
}

.stock-price-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
}

.stock-price {
    font-size: clamp(13px, 3vw, 16px);
    font-weight: 600;
}

.stock-change {
    font-size: clamp(11px, 2.5vw, 12px);
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 4px;
}

.stock-change.positive {
    color: #4ade80;
    background: rgba(74, 222, 128, 0.1);
}

.stock-change.negative {
    color: #f87171;
    background: rgba(248, 113, 113, 0.1);
}

.stock-chart {
    margin-left: 8px;
}

.sparkline {
    display: block;
}

.stock-chart.positive polyline {
    stroke: #4ade80;
}

.stock-chart.negative polyline {
    stroke: #f87171;
}

/* GitHub Widget */
.github-widget {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    min-height: 350px;
    padding: 12px;
}

.github-header {
    margin-bottom: 12px;
}

.github-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.github-title {
    font-size: clamp(14px, 3.5vw, 18px);
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.github-icon {
    font-size: clamp(16px, 4vw, 20px);
}

.unread-badge {
    background: #f85149;
    color: white;
    font-size: clamp(10px, 2vw, 11px);
    padding: 2px 6px;
    border-radius: 10px;
    font-weight: 700;
}

.github-controls {
    display: flex;
    gap: 8px;
    align-items: center;
}

.github-tabs {
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 8px;
    flex-wrap: wrap;
}

.github-tab {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    font-size: clamp(10px, 2.2vw, 12px);
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
    white-space: nowrap;
    flex-shrink: 0;
}

.github-tab:hover {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.9);
}

.github-tab.active {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-weight: 600;
}

.github-content {
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 4px;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
    transition: max-height 0.3s ease;
}

.size-compact .github-content {
    max-height: 200px;
}

.size-normal .github-content {
    max-height: 350px;
}

.size-expanded .github-content {
    max-height: 600px;
}

.github-content::-webkit-scrollbar {
    width: 6px;
}

.github-content::-webkit-scrollbar-track {
    background: transparent;
}

.github-content::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
}

.github-content::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.4);
}

/* Notifications */
.notifications-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.notification-item {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 10px;
    display: flex;
    gap: 10px;
    align-items: flex-start;
    transition: all 0.2s ease;
}

.notification-item.unread {
    background: rgba(56, 139, 253, 0.1);
    border-color: rgba(56, 139, 253, 0.3);
}

.notification-item:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
}

.notification-icon {
    font-size: clamp(14px, 3vw, 16px);
    flex-shrink: 0;
}

.notification-content {
    flex: 1;
    min-width: 0;
}

.notification-title {
    font-size: clamp(11px, 2.5vw, 13px);
    font-weight: 600;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
    word-break: break-word;
    line-height: 1.3;
}

.notification-meta {
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: clamp(10px, 2vw, 11px);
    opacity: 0.7;
    flex-wrap: wrap;
}

.notification-repo {
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 150px;
}

.notification-number {
    color: #58a6ff;
}

.notification-status {
    font-weight: 600;
    text-transform: capitalize;
}

.notification-time {
    font-size: clamp(9px, 2vw, 10px);
    opacity: 0.6;
    flex-shrink: 0;
}

/* Pull Requests */
.prs-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.pr-item {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 10px;
    transition: all 0.2s ease;
}

.pr-item:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
}

.pr-header {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    margin-bottom: 6px;
}

.pr-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 4px;
}

.pr-title {
    font-size: clamp(11px, 2.5vw, 13px);
    font-weight: 600;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
    word-break: break-word;
    line-height: 1.3;
}

.pr-meta {
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: clamp(10px, 2vw, 11px);
    opacity: 0.7;
    margin-bottom: 6px;
    flex-wrap: wrap;
}

.pr-repo {
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 150px;
}

.pr-number {
    color: #58a6ff;
}

.pr-time {
    opacity: 0.6;
}

.pr-stats {
    display: flex;
    gap: 12px;
    align-items: center;
    font-size: clamp(10px, 2vw, 11px);
}

.pr-stat {
    display: flex;
    align-items: center;
    gap: 4px;
}

.pr-status-text {
    font-weight: 600;
    text-transform: capitalize;
    margin-left: auto;
}

/* Issues */
.issues-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.issue-item {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 10px;
    transition: all 0.2s ease;
    cursor: pointer;
}

.issue-item:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
}

.issue-item.selected {
    background: rgba(163, 113, 247, 0.15);
    border-color: rgba(163, 113, 247, 0.4);
}

.issue-header {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    margin-bottom: 6px;
}

.issue-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 4px;
}

.issue-title {
    font-size: clamp(11px, 2.5vw, 13px);
    font-weight: 600;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
    word-break: break-word;
    line-height: 1.3;
}

.working-badge {
    background: #a371f7;
    color: white;
    font-size: clamp(9px, 2vw, 10px);
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 600;
    flex-shrink: 0;
}

.issue-meta {
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: clamp(10px, 2vw, 11px);
    opacity: 0.7;
    margin-bottom: 6px;
    flex-wrap: wrap;
}

.issue-repo {
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 150px;
}

.issue-number {
    color: #58a6ff;
}

.issue-time {
    opacity: 0.6;
}

.issue-labels {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.issue-label {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 2px 8px;
    border-radius: 12px;
    font-size: clamp(9px, 2vw, 10px);
    font-weight: 500;
}

/* GitHub Authentication */
.github-auth-prompt {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    text-align: center;
}

.auth-icon {
    font-size: clamp(40px, 10vw, 60px);
    margin-bottom: 16px;
}

.auth-message {
    font-size: clamp(12px, 3vw, 14px);
    margin-bottom: 20px;
    opacity: 0.8;
}

.auth-button {
    background: #238636;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    font-size: clamp(12px, 3vw, 14px);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.auth-button:hover {
    background: #2ea043;
    transform: translateY(-1px);
}

.auth-button:active {
    transform: translateY(0);
}

/* Responsive adjustments for narrow sidebars */

/* Very narrow (< 300px) */
@media (max-width: 300px) {
    .github-widget {
        padding: 8px;
        min-height: 250px;
    }

    .github-title {
        font-size: 13px;
    }

    .github-icon {
        font-size: 14px;
    }

    .github-tab {
        padding: 3px 6px;
        font-size: 9px;
    }

    .notification-item,
    .pr-item,
    .issue-item {
        padding: 6px;
        gap: 6px;
    }

    .notification-icon {
        font-size: 12px;
    }

    .notification-repo,
    .pr-repo,
    .issue-repo {
        max-width: 80px;
        font-size: 9px;
    }

    .github-content {
        max-height: 250px;
    }

    .size-compact .github-content {
        max-height: 150px;
    }

    .size-normal .github-content {
        max-height: 250px;
    }

    .size-expanded .github-content {
        max-height: 400px;
    }

    .time-digit,
    .time-separator {
        font-size: 28px;
    }

    .time-seconds {
        font-size: 14px;
    }

    .clock-date {
        font-size: 11px;
    }

    .clock-widget,
    .welcome-widget {
        min-height: 150px;
        padding: 10px;
    }
}

/* Narrow (301px - 400px) */
@media (min-width: 301px) and (max-width: 400px) {
    .github-widget {
        padding: 10px;
        min-height: 280px;
    }

    .github-title {
        font-size: 14px;
    }

    .github-icon {
        font-size: 16px;
    }

    .github-tab {
        padding: 4px 8px;
        font-size: 10px;
    }

    .notification-item,
    .pr-item,
    .issue-item {
        padding: 8px;
        gap: 8px;
    }

    .notification-icon {
        font-size: 14px;
    }

    .notification-repo,
    .pr-repo,
    .issue-repo {
        max-width: 100px;
    }

    .github-content {
        max-height: 300px;
    }

    .size-compact .github-content {
        max-height: 180px;
    }

    .size-normal .github-content {
        max-height: 300px;
    }

    .size-expanded .github-content {
        max-height: 500px;
    }

    .time-digit,
    .time-separator {
        font-size: 32px;
    }

    .time-seconds {
        font-size: 16px;
    }

    .clock-date {
        font-size: 12px;
    }

    .clock-widget,
    .welcome-widget {
        min-height: 160px;
    }
}

/* Medium-narrow (401px - 500px) */
@media (min-width: 401px) and (max-width: 500px) {
    .github-widget {
        min-height: 320px;
    }

    .notification-repo,
    .pr-repo,
    .issue-repo {
        max-width: 120px;
    }

    .clock-widget,
    .welcome-widget {
        min-height: 170px;
    }
}
`;

