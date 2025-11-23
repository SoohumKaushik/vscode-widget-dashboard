import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { globalStyles } from './styles';

// Inject global styles
const styleElement = document.createElement('style');
styleElement.textContent = globalStyles;
document.head.appendChild(styleElement);

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}

