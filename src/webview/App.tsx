import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';

export const App: React.FC = () => {
    const [widgets, setWidgets] = useState<any[]>([]);

    useEffect(() => {
        // Load saved widgets from VS Code state
        const savedWidgets = (window as any).vscodeState?.widgets || [];
        setWidgets(savedWidgets);

        // Listen for messages from the extension
        window.addEventListener('message', (event) => {
            const message = event.data;
            switch (message.type) {
                case 'addWidget':
                    // Handle add widget
                    break;
            }
        });
    }, []);

    const addWidget = (widgetType: string) => {
        const newWidget = {
            id: Date.now().toString(),
            type: widgetType,
            position: { x: 0, y: 0 },
            size: 'medium',
        };
        setWidgets([...widgets, newWidget]);
    };

    const removeWidget = (id: string) => {
        setWidgets(widgets.filter((w) => w.id !== id));
    };

    const appStyle: React.CSSProperties = {
        width: '100%',
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
        WebkitFontSmoothing: 'antialiased',
    };

    return (
        <div style={appStyle}>
            <Dashboard
                widgets={widgets}
                onAddWidget={addWidget}
                onRemoveWidget={removeWidget}
            />
        </div>
    );
};

