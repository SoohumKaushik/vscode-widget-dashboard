import React, { useState, useEffect } from 'react';

interface QuickNotesWidgetProps {
    onSave?: (notes: string) => void;
    initialNotes?: string;
}

export const QuickNotesWidget: React.FC<QuickNotesWidgetProps> = ({ onSave, initialNotes = '' }) => {
    const [notes, setNotes] = useState(initialNotes);

    useEffect(() => {
        // Auto-save after 1 second of no typing
        const timer = setTimeout(() => {
            if (onSave && notes !== initialNotes) {
                onSave(notes);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [notes, onSave, initialNotes]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value);
    };

    const charCount = notes.length;
    const maxChars = 1000;

    return (
        <div className="widget quick-notes-widget">
            <div className="widget-content">
                <div className="notes-header">
                    <h3 className="notes-title">📝 Quick Notes</h3>
                    <span className="char-count">
                        {charCount}/{maxChars}
                    </span>
                </div>

                <textarea
                    className="notes-textarea"
                    value={notes}
                    onChange={handleChange}
                    placeholder="Jot down your thoughts, ideas, or reminders..."
                    maxLength={maxChars}
                />

                <div className="notes-footer">
                    <span className="auto-save-indicator">
                        {notes !== initialNotes ? '💾 Saving...' : '✓ Saved'}
                    </span>
                </div>
            </div>
        </div>
    );
};

