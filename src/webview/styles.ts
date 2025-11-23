export const globalStyles = `
/* Apple-inspired Design System */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text',
                 'Helvetica Neue', Arial, sans-serif;
    background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
    color: #ffffff;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.dashboard {
    padding: 24px;
    min-height: 100vh;
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
    font-size: 32px;
    font-weight: 700;
    letter-spacing: -0.5px;
}

.dashboard-actions {
    display: flex;
    gap: 12px;
}

.action-button {
    padding: 8px 16px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    background: var(--vscode-button-secondaryBackground);
    color: var(--vscode-button-secondaryForeground);
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
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

.widget-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    padding: 12px;
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
    padding: 16px;
    min-height: 150px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    transition: all 0.2s ease;
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
}

.clock-time {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 4px;
    margin-bottom: 8px;
}

.time-digit {
    font-size: 56px;
    font-weight: 700;
    letter-spacing: -2px;
    line-height: 1;
    font-variant-numeric: tabular-nums;
}

.time-separator {
    font-size: 56px;
    font-weight: 300;
    opacity: 0.8;
    animation: blink 1s ease-in-out infinite;
}

@keyframes blink {
    0%, 49% { opacity: 0.8; }
    50%, 100% { opacity: 0.2; }
}

.time-seconds {
    font-size: 24px;
    font-weight: 500;
    opacity: 0.7;
    margin-left: 4px;
}

.clock-date {
    text-align: center;
    font-size: 16px;
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
}

.welcome-greeting {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: -0.5px;
}

.welcome-quote {
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    opacity: 0.9;
    font-style: italic;
    padding: 12px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 12px;
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
}

.notes-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.notes-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
}

.char-count {
    font-size: 12px;
    opacity: 0.7;
    font-weight: 500;
}

.notes-textarea {
    width: 100%;
    min-height: 160px;
    background: rgba(255, 255, 255, 0.15);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 12px;
    color: white;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
    resize: vertical;
    transition: all 0.2s ease;
    line-height: 1.6;
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
}

.ambient-header {
    margin-bottom: 16px;
}

.ambient-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
}

.sound-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 16px;
}

.sound-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    padding: 12px 8px;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
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
    font-size: 24px;
}

.sound-name {
    font-size: 11px;
    font-weight: 500;
    opacity: 0.9;
}

.player-controls {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.play-pause-btn {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    width: 48px;
    height: 48px;
    font-size: 20px;
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
    gap: 8px;
}

.volume-icon {
    font-size: 16px;
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
    font-size: 12px;
    opacity: 0.7;
    min-width: 35px;
    text-align: right;
}
`;

