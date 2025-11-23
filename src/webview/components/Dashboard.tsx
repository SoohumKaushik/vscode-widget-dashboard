import React, { useState } from 'react';
import { ClockWidget } from '../widgets/ClockWidget';
import { WelcomeWidget } from '../widgets/WelcomeWidget';
import { QuickNotesWidget } from '../widgets/QuickNotesWidget';
import { AmbientMusicWidget } from '../widgets/AmbientMusicWidget';

interface DashboardProps {
    widgets: any[];
    onAddWidget: (type: string) => void;
    onRemoveWidget: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ widgets, onAddWidget, onRemoveWidget }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [notesData, setNotesData] = useState<{[key: string]: string}>({});

    const handleNotesSave = (widgetId: string, notes: string) => {
        setNotesData(prev => ({ ...prev, [widgetId]: notes }));
        // TODO: Save to VS Code state
    };

    const renderWidget = (widget: any) => {
        switch (widget.type) {
            case 'clock':
                return <ClockWidget key={widget.id} />;
            case 'welcome':
                return <WelcomeWidget key={widget.id} />;
            case 'quicknotes':
                return (
                    <QuickNotesWidget
                        key={widget.id}
                        initialNotes={notesData[widget.id] || ''}
                        onSave={(notes) => handleNotesSave(widget.id, notes)}
                    />
                );
            case 'ambient':
                return <AmbientMusicWidget key={widget.id} />;
            default:
                return null;
        }
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Dashboard</h1>
                <div className="dashboard-actions">
                    <button 
                        className="action-button"
                        onClick={() => setIsEditMode(!isEditMode)}
                    >
                        {isEditMode ? '✓ Done' : '⚙️ Edit'}
                    </button>
                    <button 
                        className="action-button primary"
                        onClick={() => onAddWidget('clock')}
                    >
                        + Add Widget
                    </button>
                </div>
            </div>

            <div className={`widget-grid ${isEditMode ? 'edit-mode' : ''}`}>
                {/* Default widgets for demo */}
                <div className="widget-container">
                    <ClockWidget />
                </div>
                <div className="widget-container">
                    <WelcomeWidget />
                </div>
                <div className="widget-container">
                    <QuickNotesWidget
                        initialNotes={notesData['default-notes'] || ''}
                        onSave={(notes) => handleNotesSave('default-notes', notes)}
                    />
                </div>
                <div className="widget-container">
                    <AmbientMusicWidget />
                </div>

                {widgets.map((widget) => (
                    <div key={widget.id} className="widget-container">
                        {renderWidget(widget)}
                        {isEditMode && (
                            <button
                                className="remove-widget-btn"
                                onClick={() => onRemoveWidget(widget.id)}
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

