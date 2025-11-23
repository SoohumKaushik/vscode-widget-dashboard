import React, { useState, useEffect } from 'react';

interface Notification {
    id: string;
    type: 'pr' | 'issue' | 'mention' | 'review';
    title: string;
    repo: string;
    number: number;
    status: 'open' | 'merged' | 'closed';
    updatedAt: Date;
    unread: boolean;
}

interface PullRequest {
    id: string;
    title: string;
    repo: string;
    number: number;
    status: 'open' | 'merged' | 'closed' | 'draft';
    author: string;
    updatedAt: Date;
    reviews: number;
    comments: number;
}

interface Issue {
    id: string;
    title: string;
    repo: string;
    number: number;
    status: 'open' | 'closed';
    assignee: string;
    labels: string[];
    updatedAt: Date;
}

type ViewMode = 'notifications' | 'prs' | 'issues';
type WidgetSize = 'compact' | 'normal' | 'expanded';

// Simulated data generators
const generateNotifications = (): Notification[] => {
    const types: Array<'pr' | 'issue' | 'mention' | 'review'> = ['pr', 'issue', 'mention', 'review'];
    const statuses: Array<'open' | 'merged' | 'closed'> = ['open', 'merged', 'closed'];
    const repos = ['user/awesome-project', 'company/main-app', 'team/backend-api'];
    
    return Array.from({ length: 8 }, (_, i) => ({
        id: `notif-${i}`,
        type: types[Math.floor(Math.random() * types.length)],
        title: `${types[i % types.length] === 'pr' ? 'PR' : 'Issue'}: Fix critical bug in authentication`,
        repo: repos[i % repos.length],
        number: 100 + i,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        updatedAt: new Date(Date.now() - Math.random() * 86400000 * 7),
        unread: Math.random() > 0.5
    }));
};

const generatePullRequests = (): PullRequest[] => {
    const statuses: Array<'open' | 'merged' | 'closed' | 'draft'> = ['open', 'merged', 'closed', 'draft'];
    const repos = ['user/awesome-project', 'company/main-app', 'team/backend-api'];
    
    return Array.from({ length: 6 }, (_, i) => ({
        id: `pr-${i}`,
        title: `Add new feature for user dashboard`,
        repo: repos[i % repos.length],
        number: 200 + i,
        status: statuses[i % statuses.length],
        author: 'you',
        updatedAt: new Date(Date.now() - Math.random() * 86400000 * 3),
        reviews: Math.floor(Math.random() * 5),
        comments: Math.floor(Math.random() * 10)
    }));
};

const generateIssues = (): Issue[] => {
    const repos = ['user/awesome-project', 'company/main-app', 'team/backend-api'];
    const labels = [['bug', 'high-priority'], ['feature'], ['documentation'], ['enhancement']];
    
    return Array.from({ length: 5 }, (_, i) => ({
        id: `issue-${i}`,
        title: `Implement user authentication flow`,
        repo: repos[i % repos.length],
        number: 300 + i,
        status: i % 3 === 0 ? 'closed' : 'open',
        assignee: 'you',
        labels: labels[i % labels.length],
        updatedAt: new Date(Date.now() - Math.random() * 86400000 * 5)
    }));
};

export const GitHubWidget: React.FC = () => {
    // Get vscode API from window (set by Dashboard)
    const vscode = (window as any).vscode;
    const [viewMode, setViewMode] = useState<ViewMode>('notifications');
    const [widgetSize, setWidgetSize] = useState<WidgetSize>('normal');
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [, setTick] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = () => {
        setLoading(true);
        setError(null);
        // Request GitHub data from extension
        vscode.postMessage({ type: 'fetchGitHubData' });
    };

    const authenticate = () => {
        vscode.postMessage({ type: 'getGitHubAuth' });
    };

    useEffect(() => {
        // Try to authenticate on mount
        authenticate();

        // Listen for messages from extension
        const messageHandler = (event: MessageEvent) => {
            const message = event.data;

            if (message.type === 'githubAuth') {
                setIsAuthenticated(true);
                fetchData();
            } else if (message.type === 'githubAuthError') {
                setIsAuthenticated(false);
                setLoading(false);
                setError(message.error);
            } else if (message.type === 'githubData') {
                // Process notifications
                const notifs: Notification[] = (message.data.notifications || []).map((n: any) => {
                    const urlParts = n.subject.url ? n.subject.url.split('/') : [];
                    const number = urlParts.length > 0 ? parseInt(urlParts[urlParts.length - 1] || '0') : 0;

                    return {
                        id: n.id,
                        type: n.subject.type === 'PullRequest' ? 'pr' : n.subject.type === 'Issue' ? 'issue' : 'mention',
                        title: n.subject.title || 'No title',
                        repo: n.repository?.full_name || 'unknown',
                        number: number,
                        status: 'open',
                        updatedAt: new Date(n.updated_at),
                        unread: n.unread
                    };
                });

                // Process pull requests
                const prs: PullRequest[] = (message.data.pullRequests || []).map((pr: any) => {
                    const repoUrl = pr.repository_url || '';
                    const repoParts = repoUrl.split('/');
                    const repo = repoParts.length >= 2 ? repoParts.slice(-2).join('/') : 'unknown';

                    return {
                        id: pr.id.toString(),
                        title: pr.title || 'No title',
                        repo: repo,
                        number: pr.number || 0,
                        status: pr.state === 'closed' && pr.pull_request?.merged_at ? 'merged' :
                                pr.draft ? 'draft' : pr.state || 'open',
                        author: pr.user?.login || 'unknown',
                        updatedAt: new Date(pr.updated_at),
                        reviews: pr.comments || 0,
                        comments: pr.comments || 0
                    };
                });

                // Process issues
                const iss: Issue[] = (message.data.issues || []).map((issue: any) => {
                    const repoUrl = issue.repository_url || '';
                    const repoParts = repoUrl.split('/');
                    const repo = repoParts.length >= 2 ? repoParts.slice(-2).join('/') : 'unknown';

                    return {
                        id: issue.id.toString(),
                        title: issue.title || 'No title',
                        repo: repo,
                        number: issue.number || 0,
                        status: issue.state || 'open',
                        assignee: issue.assignee?.login || 'you',
                        labels: (issue.labels || []).map((l: any) => l.name),
                        updatedAt: new Date(issue.updated_at)
                    };
                });

                setNotifications(notifs);
                setPullRequests(prs);
                setIssues(iss);
                setLastUpdate(new Date());
                setLoading(false);
            } else if (message.type === 'githubDataError') {
                setError(message.error);
                setLoading(false);
            }
        };

        window.addEventListener('message', messageHandler);

        // Auto-refresh every 60 seconds
        const refreshInterval = setInterval(() => {
            if (isAuthenticated) {
                fetchData();
            }
        }, 60000);

        // Update timer every second
        const tickInterval = setInterval(() => {
            setTick(prev => prev + 1);
        }, 1000);

        return () => {
            window.removeEventListener('message', messageHandler);
            clearInterval(refreshInterval);
            clearInterval(tickInterval);
        };
    }, [isAuthenticated]);

    const cycleSizeMode = () => {
        if (widgetSize === 'compact') setWidgetSize('normal');
        else if (widgetSize === 'normal') setWidgetSize('expanded');
        else setWidgetSize('compact');
    };

    const getTimeSinceUpdate = () => {
        const seconds = Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes}m ago`;
    };

    const getTimeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'pr': return '🔀';
            case 'issue': return '⚠️';
            case 'mention': return '💬';
            case 'review': return '👁️';
            default: return '📬';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return '#3fb950';
            case 'merged': return '#a371f7';
            case 'closed': return '#f85149';
            case 'draft': return '#6e7681';
            default: return '#6e7681';
        }
    };

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <div className={`github-widget size-${widgetSize}`}>
            <div className="github-header">
                <div className="github-title-row">
                    <h3 className="github-title">
                        <span className="github-icon">🐙</span> GitHub
                        {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
                    </h3>
                    <div className="github-controls">
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
                            className="refresh-btn"
                            onClick={fetchData}
                            title="Refresh"
                        >
                            🔄
                        </button>
                    </div>
                </div>
                <div className="github-tabs">
                    <button
                        className={`github-tab ${viewMode === 'notifications' ? 'active' : ''}`}
                        onClick={() => setViewMode('notifications')}
                    >
                        📬 Notifications
                    </button>
                    <button
                        className={`github-tab ${viewMode === 'prs' ? 'active' : ''}`}
                        onClick={() => setViewMode('prs')}
                    >
                        🔀 PRs
                    </button>
                    <button
                        className={`github-tab ${viewMode === 'issues' ? 'active' : ''}`}
                        onClick={() => setViewMode('issues')}
                    >
                        📋 Issues
                    </button>
                </div>
                {!loading && (
                    <div className="last-update">Updated {getTimeSinceUpdate()}</div>
                )}
            </div>

            <div className="github-content">
                {!isAuthenticated && !loading && (
                    <div className="github-auth-prompt">
                        <div className="auth-icon">🔐</div>
                        <div className="auth-message">Sign in to GitHub to see your activity</div>
                        <button className="auth-button" onClick={authenticate}>
                            Sign in with GitHub
                        </button>
                    </div>
                )}

                {error && (
                    <div className="error-text">{error}</div>
                )}

                {loading && isAuthenticated && <div className="loading-text">Loading GitHub data...</div>}

                {!loading && isAuthenticated && viewMode === 'notifications' && (
                    <div className="notifications-list">
                        {notifications.map((notif) => (
                            <div key={notif.id} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
                                <div className="notification-icon">{getNotificationIcon(notif.type)}</div>
                                <div className="notification-content">
                                    <div className="notification-title">{notif.title}</div>
                                    <div className="notification-meta">
                                        <span className="notification-repo">{notif.repo}</span>
                                        <span className="notification-number">#{notif.number}</span>
                                        <span
                                            className="notification-status"
                                            style={{ color: getStatusColor(notif.status) }}
                                        >
                                            {notif.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="notification-time">{getTimeAgo(notif.updatedAt)}</div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && isAuthenticated && viewMode === 'prs' && (
                    <div className="prs-list">
                        {pullRequests.map((pr) => (
                            <div key={pr.id} className="pr-item">
                                <div className="pr-header">
                                    <div
                                        className="pr-status-dot"
                                        style={{ backgroundColor: getStatusColor(pr.status) }}
                                    />
                                    <div className="pr-title">{pr.title}</div>
                                </div>
                                <div className="pr-meta">
                                    <span className="pr-repo">{pr.repo}</span>
                                    <span className="pr-number">#{pr.number}</span>
                                    <span className="pr-time">{getTimeAgo(pr.updatedAt)}</span>
                                </div>
                                <div className="pr-stats">
                                    <span className="pr-stat">👁️ {pr.reviews}</span>
                                    <span className="pr-stat">💬 {pr.comments}</span>
                                    <span className="pr-status-text" style={{ color: getStatusColor(pr.status) }}>
                                        {pr.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && isAuthenticated && viewMode === 'issues' && (
                    <div className="issues-list">
                        {issues.map((issue) => (
                            <div
                                key={issue.id}
                                className={`issue-item ${selectedIssue === issue.id ? 'selected' : ''}`}
                                onClick={() => setSelectedIssue(selectedIssue === issue.id ? null : issue.id)}
                            >
                                <div className="issue-header">
                                    <div
                                        className="issue-status-dot"
                                        style={{ backgroundColor: getStatusColor(issue.status) }}
                                    />
                                    <div className="issue-title">{issue.title}</div>
                                    {selectedIssue === issue.id && <span className="working-badge">🎯 Working</span>}
                                </div>
                                <div className="issue-meta">
                                    <span className="issue-repo">{issue.repo}</span>
                                    <span className="issue-number">#{issue.number}</span>
                                    <span className="issue-time">{getTimeAgo(issue.updatedAt)}</span>
                                </div>
                                <div className="issue-labels">
                                    {issue.labels.map((label, idx) => (
                                        <span key={idx} className="issue-label">{label}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

