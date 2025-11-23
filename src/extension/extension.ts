import * as vscode from 'vscode';
import * as https from 'https';
import { DashboardPanel } from './DashboardPanel';

export function activate(context: vscode.ExtensionContext) {
    console.log('Widget Dashboard extension is now active!');

    // Register command to open dashboard
    const openDashboardCommand = vscode.commands.registerCommand(
        'widgetDashboard.openDashboard',
        () => {
            DashboardPanel.createOrShow(context.extensionUri);
        }
    );

    // Register command to add widget
    const addWidgetCommand = vscode.commands.registerCommand(
        'widgetDashboard.addWidget',
        () => {
            DashboardPanel.currentPanel?.addWidget();
        }
    );

    // Register the webview view provider
    const provider = new DashboardViewProvider(context.extensionUri, context);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            'widgetDashboard.mainView',
            provider
        )
    );

    context.subscriptions.push(openDashboardCommand, addWidgetCommand);
}

export function deactivate() {}

// Helper function to make HTTPS requests
function httpsGet(url: string, headers: any): Promise<any> {
    return new Promise((resolve, reject) => {
        https.get(url, { headers }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
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
                    // Get GitHub authentication
                    try {
                        const session = await vscode.authentication.getSession('github', ['repo', 'read:user', 'notifications'], { createIfNone: true });
                        webviewView.webview.postMessage({
                            type: 'githubAuth',
                            token: session.accessToken,
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
                        const session = await vscode.authentication.getSession('github', ['repo', 'read:user', 'notifications'], { createIfNone: false });
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
            }
        });
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
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; media-src https: http:; img-src ${webview.cspSource} https:; connect-src https://site.api.espn.com https://query1.finance.yahoo.com;">
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

