import React from 'react';
import { Dashboard } from './components/Dashboard';

const appStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
    WebkitFontSmoothing: 'antialiased',
};

export const App: React.FC = () => (
    <div style={appStyle}>
        <Dashboard />
    </div>
);
