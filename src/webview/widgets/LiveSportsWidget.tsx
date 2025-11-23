import React, { useState, useEffect } from 'react';

interface Game {
    id: string;
    name: string;
    shortName: string;
    date: string;
    status: {
        type: {
            state: string;
            completed: boolean;
        };
        displayClock: string;
        period: number;
    };
    competitions: Array<{
        competitors: Array<{
            id: string;
            team: {
                displayName: string;
                abbreviation: string;
                logo: string;
            };
            score: string;
            homeAway: 'home' | 'away';
        }>;
    }>;
}

interface ScoreboardData {
    events: Game[];
}

type League = 'nba' | 'nfl';

type WidgetSize = 'compact' | 'normal' | 'expanded';

export const LiveSportsWidget: React.FC = () => {
    const [selectedLeague, setSelectedLeague] = useState<League>('nfl');
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [, setTick] = useState(0); // Force re-render for time updates
    const [widgetSize, setWidgetSize] = useState<WidgetSize>('normal');

    const fetchScores = async (league: League, isManual = false) => {
        if (isManual) {
            setIsRefreshing(true);
        } else {
            setLoading(true);
        }
        setError(null);

        try {
            const sport = league === 'nba' ? 'basketball' : 'football';
            const url = `https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/scoreboard`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch scores');
            }

            const data: ScoreboardData = await response.json();
            setGames(data.events || []);
            setLastUpdate(new Date());
        } catch (err) {
            setError('Failed to load scores');
            console.error('Error fetching scores:', err);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleManualRefresh = () => {
        fetchScores(selectedLeague, true);
    };

    useEffect(() => {
        fetchScores(selectedLeague);

        // Refresh every 30 seconds
        const refreshInterval = setInterval(() => {
            fetchScores(selectedLeague);
        }, 30000);

        // Update "time ago" every second
        const tickInterval = setInterval(() => {
            setTick(prev => prev + 1);
        }, 1000);

        return () => {
            clearInterval(refreshInterval);
            clearInterval(tickInterval);
        };
    }, [selectedLeague]);

    const getGameStatus = (game: Game) => {
        const { status } = game;
        if (status.type.completed) return 'FINAL';
        if (status.type.state === 'in') {
            return `${status.displayClock} - Q${status.period}`;
        }
        return new Date(game.date).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit' 
        });
    };

    const getTimeSinceUpdate = () => {
        const seconds = Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes}m ago`;
    };

    const cycleSizeMode = () => {
        if (widgetSize === 'compact') setWidgetSize('normal');
        else if (widgetSize === 'normal') setWidgetSize('expanded');
        else setWidgetSize('compact');
    };

    return (
        <div className={`live-sports-widget size-${widgetSize}`}>
            <div className="sports-header">
                <div className="sports-title-row">
                    <h3 className="sports-title">🏀 Live Sports</h3>
                    <div className="sports-controls">
                        <button
                            className="size-toggle-btn"
                            onClick={cycleSizeMode}
                            title={`Size: ${widgetSize}`}
                        >
                            {widgetSize === 'compact' && '⊟'}
                            {widgetSize === 'normal' && '⊡'}
                            {widgetSize === 'expanded' && '⊞'}
                        </button>
                        <button
                            className={`refresh-btn ${isRefreshing ? 'spinning' : ''}`}
                            onClick={handleManualRefresh}
                            disabled={isRefreshing}
                            title="Refresh scores"
                        >
                            🔄
                        </button>
                    </div>
                </div>
                <div className="league-selector">
                    <button
                        className={`league-btn ${selectedLeague === 'nfl' ? 'active' : ''}`}
                        onClick={() => setSelectedLeague('nfl')}
                    >
                        🏈 NFL
                    </button>
                    <button
                        className={`league-btn ${selectedLeague === 'nba' ? 'active' : ''}`}
                        onClick={() => setSelectedLeague('nba')}
                    >
                        🏀 NBA
                    </button>
                </div>
                {!loading && !error && (
                    <div className="last-update">Updated {getTimeSinceUpdate()}</div>
                )}
            </div>

            <div className="games-container">
                {loading && <div className="loading-text">Loading scores...</div>}

                {error && <div className="error-text">{error}</div>}

                {!loading && !error && games.length === 0 && (
                    <div className="no-games-text">No games today</div>
                )}

                {!loading && !error && games.map((game) => {
                    const competition = game.competitions[0];
                    const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
                    const awayTeam = competition.competitors.find(c => c.homeAway === 'away');
                    
                    if (!homeTeam || !awayTeam) return null;
                    
                    return (
                        <div key={game.id} className="game-card">
                            <div className="game-status">{getGameStatus(game)}</div>
                            
                            <div className="team-row">
                                <div className="team-info">
                                    <img src={awayTeam.team.logo} alt={awayTeam.team.displayName} className="team-logo" />
                                    <span className="team-name">{awayTeam.team.abbreviation}</span>
                                </div>
                                <span className="team-score">{awayTeam.score}</span>
                            </div>
                            
                            <div className="team-row">
                                <div className="team-info">
                                    <img src={homeTeam.team.logo} alt={homeTeam.team.displayName} className="team-logo" />
                                    <span className="team-name">{homeTeam.team.abbreviation}</span>
                                </div>
                                <span className="team-score">{homeTeam.score}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

