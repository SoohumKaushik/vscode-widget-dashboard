import React, { useState, useEffect } from 'react';
import { ClockWidget } from '../widgets/ClockWidget';
import { QuickNotesWidget } from '../widgets/QuickNotesWidget';
import { AmbientMusicWidget } from '../widgets/AmbientMusicWidget';
import { LiveSportsWidget } from '../widgets/LiveSportsWidget';
import { StockMarketWidget } from '../widgets/StockMarketWidget';
import { GitHubWidget } from '../widgets/GitHubWidget';

interface DashboardProps {
    widgets: any[];
    onAddWidget: (type: string) => void;
    onRemoveWidget: (id: string) => void;
}

declare const acquireVsCodeApi: any;
const vscode = acquireVsCodeApi();
// Store on window for other components to access
(window as any).vscode = vscode;

interface Widget {
    id: string;
    type: string;
    size: 'small' | 'medium' | 'large' | 'wide' | 'tall';
    order: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ widgets, onAddWidget, onRemoveWidget }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [notesData, setNotesData] = useState<{[key: string]: string}>({});
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [userWidgets, setUserWidgets] = useState<Widget[]>([]);
    const [isStateLoaded, setIsStateLoaded] = useState(false);
    const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
    const [dragOverWidget, setDragOverWidget] = useState<string | null>(null);

    // Load state on mount
    useEffect(() => {
        // Request saved state from extension
        vscode.postMessage({ type: 'getState' });

        // Listen for state from extension
        const messageHandler = (event: MessageEvent) => {
            const message = event.data;
            if (message.type === 'setState' && message.state) {
                if (message.state.widgets && message.state.widgets.length > 0) {
                    // Ensure all widgets have required fields
                    const migratedWidgets = message.state.widgets.map((w: any, index: number) => ({
                        id: w.id,
                        type: w.type,
                        size: w.size || 'medium',
                        order: w.order !== undefined ? w.order : index
                    }));
                    setUserWidgets(migratedWidgets);
                } else {
                    // First time - add clock by default
                    setUserWidgets([{
                        id: 'default-clock',
                        type: 'clock',
                        size: 'medium',
                        order: 0
                    }]);
                }
                if (message.state.notesData) {
                    setNotesData(message.state.notesData);
                }
                setIsStateLoaded(true);
            }
        };

        window.addEventListener('message', messageHandler);
        return () => window.removeEventListener('message', messageHandler);
    }, []);

    // Save state whenever it changes
    useEffect(() => {
        if (isStateLoaded) {
            vscode.postMessage({
                type: 'saveState',
                state: {
                    widgets: userWidgets,
                    notesData: notesData
                }
            });
        }
    }, [userWidgets, notesData, isStateLoaded]);

    const handleNotesSave = (widgetId: string, notes: string) => {
        setNotesData(prev => ({ ...prev, [widgetId]: notes }));
    };

    const handleAddWidget = (type: string) => {
        const newWidget: Widget = {
            id: `widget-${Date.now()}`,
            type: type,
            size: 'medium',
            order: userWidgets.length
        };
        setUserWidgets(prev => [...prev, newWidget]);
        setShowAddMenu(false);
    };

    const handleRemoveWidget = (id: string) => {
        setUserWidgets(prev => prev.filter(w => w.id !== id));
    };

    const handleWidgetSizeChange = (id: string, newSize: 'small' | 'medium' | 'large' | 'wide' | 'tall') => {
        setUserWidgets(prev => prev.map(w =>
            w.id === id ? { ...w, size: newSize } : w
        ));
    };

    const handleDragStart = (e: React.DragEvent, widgetId: string) => {
        setDraggedWidget(widgetId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, widgetId: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverWidget(widgetId);
    };

    const handleDragEnd = () => {
        setDraggedWidget(null);
        setDragOverWidget(null);
    };

    const handleDrop = (e: React.DragEvent, targetWidgetId: string) => {
        e.preventDefault();

        if (!draggedWidget || draggedWidget === targetWidgetId) {
            setDraggedWidget(null);
            setDragOverWidget(null);
            return;
        }

        const draggedIndex = userWidgets.findIndex(w => w.id === draggedWidget);
        const targetIndex = userWidgets.findIndex(w => w.id === targetWidgetId);

        if (draggedIndex === -1 || targetIndex === -1) return;

        const newWidgets = [...userWidgets];
        const [removed] = newWidgets.splice(draggedIndex, 1);
        newWidgets.splice(targetIndex, 0, removed);

        // Update order
        const reorderedWidgets = newWidgets.map((w, index) => ({
            ...w,
            order: index
        }));

        setUserWidgets(reorderedWidgets);
        setDraggedWidget(null);
        setDragOverWidget(null);
    };

    const renderWidget = (widget: any) => {
        switch (widget.type) {
            case 'clock':
                return <ClockWidget key={widget.id} />;
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
            case 'sports':
                return <LiveSportsWidget key={widget.id} />;
            case 'stocks':
                return <StockMarketWidget key={widget.id} />;
            case 'github':
                return <GitHubWidget key={widget.id} />;
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
                        className="action-button edit-btn"
                        onClick={() => setIsEditMode(!isEditMode)}
                    >
                        <span className="btn-icon">⚙️</span>
                        <span className="btn-text">{isEditMode ? 'Done' : 'Edit'}</span>
                    </button>
                    <button
                        className="action-button primary add-btn"
                        onClick={() => setShowAddMenu(!showAddMenu)}
                    >
                        <span className="btn-icon">+</span>
                        <span className="btn-text">Add Widget</span>
                    </button>
                </div>
            </div>

            {/* Widget Gallery */}
            {showAddMenu && (
                <>
                    <div className="modal-overlay" onClick={() => setShowAddMenu(false)} />
                    <div className="widget-gallery">
                        <div className="gallery-header">
                            <h2>Add Widget</h2>
                            <button className="modal-close" onClick={() => setShowAddMenu(false)}>×</button>
                        </div>
                        <div className="gallery-grid">
                            {/* Clock */}
                            <div
                                className="gallery-item"
                                onClick={() => handleAddWidget('clock')}
                            >
                                <div className="gallery-preview-mini">
                                    <div className="preview-mini-content">
                                        <div className="preview-header">🕐 Clock</div>
                                        <div className="preview-footer" style={{textAlign: 'center', fontSize: '18px', marginTop: '8px'}}>12:00</div>
                                    </div>
                                </div>
                                <div className="gallery-name">Clock</div>
                            </div>

                            {/* Quick Notes */}
                            <div
                                className="gallery-item"
                                onClick={() => handleAddWidget('quicknotes')}
                            >
                                <div className="gallery-preview-mini">
                                    <div className="preview-mini-content">
                                        <div className="preview-header">📝 Quick Notes</div>
                                        <div className="preview-textarea"></div>
                                        <div className="preview-footer">0/1000</div>
                                    </div>
                                </div>
                                <div className="gallery-name">Quick Notes</div>
                            </div>

                            {/* Ambient Sounds */}
                            <div
                                className="gallery-item"
                                onClick={() => handleAddWidget('ambient')}
                            >
                                <div className="gallery-preview-mini">
                                    <div className="preview-mini-content">
                                        <div className="preview-header">🎵 Ambient Sounds</div>
                                        <div className="preview-buttons">
                                            <div className="preview-btn">🌧️</div>
                                            <div className="preview-btn">🌊</div>
                                            <div className="preview-btn">🔥</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="gallery-name">Ambient Sounds</div>
                            </div>

                            {/* Live Sports */}
                            <div
                                className="gallery-item"
                                onClick={() => handleAddWidget('sports')}
                            >
                                <div className="gallery-preview-mini">
                                    <div className="preview-mini-content">
                                        <div className="preview-header">🏈 Live Sports</div>
                                        <div className="preview-sport-tabs">
                                            <div className="preview-tab">NFL</div>
                                            <div className="preview-tab">NBA</div>
                                        </div>
                                        <div className="preview-game">
                                            <div className="preview-team">Team A vs Team B</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="gallery-name">Live Sports</div>
                            </div>

                            {/* Stock Market */}
                            <div
                                className="gallery-item"
                                onClick={() => handleAddWidget('stocks')}
                            >
                                <div className="gallery-preview-mini">
                                    <div className="preview-mini-content">
                                        <div className="preview-header">📈 Markets</div>
                                        <div className="preview-game" style={{padding: '6px'}}>
                                            <div className="preview-team" style={{fontSize: '8px'}}>AAPL $150.00 +2.5%</div>
                                            <div className="preview-team" style={{fontSize: '8px'}}>BTC $45K +5.2%</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="gallery-name">Stock Market</div>
                            </div>

                            {/* GitHub */}
                            <div
                                className="gallery-item"
                                onClick={() => handleAddWidget('github')}
                            >
                                <div className="gallery-preview-mini">
                                    <div className="preview-mini-content">
                                        <div className="preview-header">🐙 GitHub</div>
                                        <div className="preview-game" style={{padding: '6px'}}>
                                            <div className="preview-team" style={{fontSize: '8px'}}>📬 3 notifications</div>
                                            <div className="preview-team" style={{fontSize: '8px'}}>🔀 2 open PRs</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="gallery-name">GitHub Activity</div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className={`widget-grid ${isEditMode ? 'edit-mode' : ''}`}>
                {userWidgets
                    .sort((a, b) => a.order - b.order)
                    .map((widget) => (
                    <div
                        key={widget.id}
                        className={`widget-container widget-size-${widget.size} ${draggedWidget === widget.id ? 'dragging' : ''} ${dragOverWidget === widget.id ? 'drag-over' : ''}`}
                        draggable={isEditMode}
                        onDragStart={(e) => handleDragStart(e, widget.id)}
                        onDragOver={(e) => handleDragOver(e, widget.id)}
                        onDragEnd={handleDragEnd}
                        onDrop={(e) => handleDrop(e, widget.id)}
                    >
                        {renderWidget(widget)}
                        {isEditMode && (
                            <>
                                <button
                                    className="remove-widget-btn"
                                    onClick={() => handleRemoveWidget(widget.id)}
                                >
                                    ×
                                </button>
                                <div className="widget-size-controls">
                                    <button
                                        className={`size-btn ${widget.size === 'small' ? 'active' : ''}`}
                                        onClick={() => handleWidgetSizeChange(widget.id, 'small')}
                                        title="Small"
                                    >
                                        S
                                    </button>
                                    <button
                                        className={`size-btn ${widget.size === 'medium' ? 'active' : ''}`}
                                        onClick={() => handleWidgetSizeChange(widget.id, 'medium')}
                                        title="Medium"
                                    >
                                        M
                                    </button>
                                    <button
                                        className={`size-btn ${widget.size === 'large' ? 'active' : ''}`}
                                        onClick={() => handleWidgetSizeChange(widget.id, 'large')}
                                        title="Large"
                                    >
                                        L
                                    </button>
                                    <button
                                        className={`size-btn ${widget.size === 'wide' ? 'active' : ''}`}
                                        onClick={() => handleWidgetSizeChange(widget.id, 'wide')}
                                        title="Wide"
                                    >
                                        ↔
                                    </button>
                                    <button
                                        className={`size-btn ${widget.size === 'tall' ? 'active' : ''}`}
                                        onClick={() => handleWidgetSizeChange(widget.id, 'tall')}
                                        title="Tall"
                                    >
                                        ↕
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

