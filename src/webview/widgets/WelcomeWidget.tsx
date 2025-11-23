import React from 'react';

export const WelcomeWidget: React.FC = () => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const quotes = [
        "Code is like humor. When you have to explain it, it's bad.",
        "First, solve the problem. Then, write the code.",
        "Make it work, make it right, make it fast.",
        "Clean code always looks like it was written by someone who cares.",
        "The best error message is the one that never shows up.",
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    return (
        <div className="widget welcome-widget">
            <div className="widget-content">
                <div className="welcome-greeting">
                    {getGreeting()} 👋
                </div>
                <div className="welcome-quote">
                    "{randomQuote}"
                </div>
            </div>
        </div>
    );
};

