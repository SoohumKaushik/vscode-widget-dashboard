import * as vscode from 'vscode';
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
    const provider = new DashboardViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            'widgetDashboard.mainView',
            provider
        )
    );

    context.subscriptions.push(openDashboardCommand, addWidgetCommand);
}

export function deactivate() {}

class DashboardViewProvider implements vscode.WebviewViewProvider {
    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage((data) => {
            switch (data.type) {
                case 'info':
                    vscode.window.showInformationMessage(data.message);
                    break;
                case 'error':
                    vscode.window.showErrorMessage(data.message);
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
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; media-src https: http:; img-src ${webview.cspSource} https:;">
                <title>Widget Dashboard</title>
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

