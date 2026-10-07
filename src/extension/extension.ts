import * as vscode from 'vscode';
import * as https from 'https';

// Least-privilege GitHub scopes: enough to read your notifications and search
// your own PRs/issues, without the write access that the full `repo` scope grants.
const GITHUB_SCOPES = ['read:user', 'notifications'];

export function activate(context: vscode.ExtensionContext) {
    console.log('Widget Dashboard extension is now active!');

    // Register the webview view provider (the dashboard lives in the activity bar)
    const provider = new DashboardViewProvider(context.extensionUri, context);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            'widgetDashboard.mainView',
            provider
        )
    );

    // "Open Widget Dashboard" reveals the dashboard view in the activity bar.
    const openDashboardCommand = vscode.commands.registerCommand(
        'widgetDashboard.openDashboard',
        () => vscode.commands.executeCommand('widgetDashboard.mainView.focus')
    );

    // "Add Widget" reveals the view, then opens its widget gallery.
    const addWidgetCommand = vscode.commands.registerCommand(
        'widgetDashboard.addWidget',
        async () => {
            await vscode.commands.executeCommand('widgetDashboard.mainView.focus');
            provider.openAddMenu();
        }
    );

    context.subscriptions.push(openDashboardCommand, addWidgetCommand);
}

export function deactivate() {}

// GET a URL and parse the JSON body. Rejects on HTTP errors and on timeouts so
// a slow or rate-limited API can't leave a widget stuck in its loading state.
function httpsGet(url: string, headers: Record<string, string>, timeoutMs = 10000): Promise<any> {
    return new Promise((resolve, reject) => {
        const req = https.get(url, { headers }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode && res.statusCode >= 400) {
                    reject(new Error(`HTTP ${res.statusCode} from ${new URL(url).host}`));
                    return;
                }
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        });
        req.setTimeout(timeoutMs, () => req.destroy(new Error(`Request to ${new URL(url).host} timed out`)));
        req.on('error', reject);
    });
}

interface Quote {
    symbol: string;
    price: number;
    /** Change vs. the previous close (stocks) or vs. 24 hours ago (crypto). */
    changePercent: number;
    /** The price that `changePercent` is measured from. */
    baseline: number;
    /** Intraday prices for the sparkline, oldest first. */
    sparkline: number[];
    /** False when the symbol's exchange is outside regular trading hours. */
    marketOpen: boolean;
}

// Fetch a quote from Yahoo Finance's public chart endpoint (no API key needed).
async function fetchQuote(symbol: string): Promise<Quote> {
    // Crypto trades 24/7, so use a rolling 24h window (what exchanges and Yahoo's
    // own quote page show) rather than "since midnight UTC".
    const isCrypto = symbol.endsWith('-USD');
    const query = isCrypto ? 'interval=15m&range=2d' : 'interval=5m&range=1d';
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?${query}`;
    const json = await httpsGet(url, { 'User-Agent': 'VSCode-Widget-Dashboard' });

    const result = json?.chart?.result?.[0];
    if (!result) {
        throw new Error(`No chart data for ${symbol}`);
    }
    const meta = result.meta || {};
    const timestamps: number[] = result.timestamp || [];
    const rawCloses: (number | null)[] = result.indicators?.quote?.[0]?.close || [];

    const nowSec = Date.now() / 1000;
    const since = isCrypto ? nowSec - 24 * 60 * 60 : 0;
    const sparkline = rawCloses.filter(
        (v, i): v is number => typeof v === 'number' && (timestamps[i] ?? 0) >= since
    );

    const price: number | undefined = meta.regularMarketPrice ?? sparkline[sparkline.length - 1];
    if (typeof price !== 'number') {
        throw new Error(`No price for ${symbol}`);
    }

    let changePercent: number;
    if (isCrypto) {
        // Yahoo reports the 24h change directly; fall back to the window start.
        changePercent = typeof meta.regularMarketChangePercent === 'number'
            ? meta.regularMarketChangePercent
            : (sparkline.length ? (price / sparkline[0] - 1) * 100 : 0);
    } else {
        const prevClose = meta.previousClose ?? meta.chartPreviousClose;
        changePercent = prevClose ? (price / prevClose - 1) * 100 : 0;
    }

    const regular = meta.currentTradingPeriod?.regular;
    const marketOpen = isCrypto || (regular ? nowSec >= regular.start && nowSec < regular.end : false);

    return {
        symbol,
        price,
        changePercent,
        baseline: price / (1 + changePercent / 100),
        sparkline,
        marketOpen,
    };
}

class DashboardViewProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly _context: vscode.ExtensionContext
    ) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case 'info':
                    vscode.window.showInformationMessage(data.message);
                    break;
                case 'error':
                    vscode.window.showErrorMessage(data.message);
                    break;
                case 'saveState':
                    // Save the state to global storage
                    this._context.globalState.update('widgetDashboardState', data.state);
                    break;
                case 'getState':
                    // Send the saved state back to the webview
                    const savedState = this._context.globalState.get('widgetDashboardState');
                    webviewView.webview.postMessage({
                        type: 'setState',
                        state: savedState || { widgets: [] }
                    });
                    break;
                case 'getGitHubAuth':
                    // Get GitHub authentication. The access token stays in the
                    // extension host and is never sent to the webview — the webview
                    // only needs to know that sign-in succeeded.
                    try {
                        const session = await vscode.authentication.getSession('github', GITHUB_SCOPES, { createIfNone: true });
                        webviewView.webview.postMessage({
                            type: 'githubAuth',
                            username: session.account.label
                        });
                    } catch (error) {
                        webviewView.webview.postMessage({
                            type: 'githubAuthError',
                            error: 'Failed to authenticate with GitHub'
                        });
                    }
                    break;
                case 'fetchGitHubData':
                    // Fetch GitHub data using the token
                    try {
                        const session = await vscode.authentication.getSession('github', GITHUB_SCOPES, { createIfNone: false });
                        if (!session) {
                            webviewView.webview.postMessage({
                                type: 'githubDataError',
                                error: 'Not authenticated'
                            });
                            return;
                        }

                        const token = session.accessToken;
                        const headers = {
                            'Authorization': `token ${token}`,
                            'Accept': 'application/vnd.github.v3+json',
                            'User-Agent': 'VSCode-Widget-Dashboard'
                        };

                        // Fetch notifications, PRs, and issues in parallel
                        const [notifications, prs, issues] = await Promise.all([
                            httpsGet('https://api.github.com/notifications?all=false&per_page=20', headers),
                            httpsGet('https://api.github.com/search/issues?q=is:pr+author:@me+sort:updated-desc&per_page=10', headers),
                            httpsGet('https://api.github.com/search/issues?q=is:issue+assignee:@me+sort:updated-desc&per_page=10', headers)
                        ]);

                        webviewView.webview.postMessage({
                            type: 'githubData',
                            data: {
                                notifications: notifications,
                                pullRequests: prs.items || [],
                                issues: issues.items || []
                            }
                        });
                    } catch (error) {
                        console.error('GitHub API error:', error);
                        webviewView.webview.postMessage({
                            type: 'githubDataError',
                            error: 'Failed to fetch GitHub data'
                        });
                    }
                    break;
                case 'fetchStockData': {
                    // Fetched in the extension host because the webview's CSP and
                    // CORS rules block direct calls to Yahoo Finance.
                    const symbols: string[] = Array.isArray(data.symbols) ? data.symbols : [];
                    const results = await Promise.all(symbols.map(async (symbol) => {
                        try {
                            return await fetchQuote(symbol);
                        } catch (error) {
                            console.error(`Quote error for ${symbol}:`, error);
                            return { symbol, error: true };
                        }
                    }));
                    if (results.every((r) => 'error' in r)) {
                        webviewView.webview.postMessage({
                            type: 'stockDataError',
                            error: 'Could not reach Yahoo Finance'
                        });
                    } else {
                        webviewView.webview.postMessage({ type: 'stockData', data: results });
                    }
                    break;
                }
            }
        });
    }

    /** Ask the webview to open its "Add Widget" gallery. */
    public openAddMenu() {
        this._view?.webview.postMessage({ type: 'openAddMenu' });
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview.js')
        );

        const nonce = getNonce();

        return `<!DOCTYPE html>
            <html lang="en" style="height: 100%; overflow: hidden;">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; media-src https: http:; img-src ${webview.cspSource} https:; connect-src https://site.api.espn.com;">
                <title>Widget Dashboard</title>
                <style>
                    html, body {
                        margin: 0;
                        padding: 0;
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                    }
                    #root {
                        width: 100%;
                        height: 100%;
                        overflow-y: auto;
                        overflow-x: hidden;
                    }
                </style>
            </head>
            <body>
                <div id="root"></div>
                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
            </html>`;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

