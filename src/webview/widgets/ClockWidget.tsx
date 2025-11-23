import React, { useState, useEffect } from 'react';

export const ClockWidget: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[time.getDay()];
    const monthName = months[time.getMonth()];
    const date = time.getDate();

    return (
        <div className="widget clock-widget">
            <div className="widget-content">
                <div className="clock-time">
                    <span className="time-digit">{hours}</span>
                    <span className="time-separator">:</span>
                    <span className="time-digit">{minutes}</span>
                    <span className="time-seconds">{seconds}</span>
                </div>
                <div className="clock-date">
                    {dayName}, {monthName} {date}
                </div>
            </div>
        </div>
    );
};

