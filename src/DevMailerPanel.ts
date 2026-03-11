import * as vscode from 'vscode';
import { MailMessage } from './mailService';

export class DevMailerPanel implements vscode.WebviewViewProvider {
    public static readonly viewType = 'devmailer-view';
    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        console.log('DevMailer Webview resolving...');
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.type) {
                case 'login':
                    vscode.commands.executeCommand('devmailer.login');
                    break;
                case 'logout':
                    vscode.commands.executeCommand('devmailer.logout');
                    break;
                case 'refresh':
                    vscode.commands.executeCommand('devmailer.refresh');
                    break;
                case 'generateNew':
                    vscode.commands.executeCommand('devmailer.generateNew');
                    break;
                case 'copyAddress':
                    vscode.env.clipboard.writeText(data.address);
                    vscode.window.showInformationMessage('Email address copied to clipboard!');
                    break;
                case 'openMessage':
                    vscode.commands.executeCommand('devmailer.openMessage', data.messageId);
                    break;
            }
        });
    }

    public updateState(address: string, messages: MailMessage[], loading: boolean = false) {
        if (this._view) {
            this._view.webview.postMessage({
                type: 'update',
                address,
                messages,
                loading
            });
        }
    }

    public updateAuthState(user: any) {
        if (this._view) {
            this._view.webview.postMessage({
                type: 'authUpdate',
                user
            });
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    :root {
                        --padding: 16px;
                        --border-radius: 12px;
                        --bg-secondary: var(--vscode-sideBar-background);
                        --item-hover: var(--vscode-list-hoverBackground);
                        --text-muted: var(--vscode-descriptionForeground);
                        --accent: #3b82f6;
                        --accent-hover: #2563eb;
                        --card-bg: var(--vscode-editor-background);
                    }
                    body {
                        padding: 0;
                        margin: 0;
                        font-family: var(--vscode-font-family);
                        color: var(--vscode-foreground);
                        background-color: var(--vscode-sideBar-background);
                        overflow: hidden;
                    }
                    .container {
                        display: flex;
                        flex-direction: column;
                        height: 100vh;
                        position: relative;
                    }
                    
                    /* Auth View */
                    #authView {
                        display: none;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        height: 100%;
                        padding: 20px;
                        text-align: center;
                    }
                    .logo-placeholder {
                        width: 64px;
                        height: 64px;
                        background: var(--accent);
                        border-radius: 16px;
                        margin-bottom: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
                    }
                    .auth-title {
                        font-size: 1.5rem;
                        font-weight: 700;
                        margin-bottom: 8px;
                    }
                    .auth-desc {
                        color: var(--text-muted);
                        margin-bottom: 32px;
                        line-height: 1.5;
                    }
                    .google-btn {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        background: white;
                        color: #374151;
                        border: 1px solid #d1d5db;
                        padding: 10px 24px;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    }
                    .google-btn:hover {
                        background: #f9fafb;
                        border-color: #9ca3af;
                        transform: translateY(-1px);
                    }

                    /* Main View */
                    #mainView {
                        display: none;
                        flex-direction: column;
                        height: 100%;
                    }
                    .header {
                        padding: var(--padding);
                        border-bottom: 1px solid var(--vscode-divider);
                    }
                    .user-bar {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 16px;
                    }
                    .user-info {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .avatar {
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        background: var(--accent);
                    }
                    .username {
                        font-size: 0.85em;
                        font-weight: 600;
                        color: var(--text-muted);
                    }
                    .logout-btn {
                        font-size: 0.8em;
                        color: var(--text-muted);
                        cursor: pointer;
                        background: none;
                        border: none;
                        padding: 2px 6px;
                        border-radius: 4px;
                    }
                    .logout-btn:hover {
                        background: var(--item-hover);
                        color: var(--vscode-foreground);
                    }
                    .address-card {
                        background: var(--card-bg);
                        padding: 12px;
                        border-radius: var(--border-radius);
                        margin-bottom: 12px;
                        border: 1px solid var(--vscode-widget-border);
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 8px;
                    }
                    .address-text {
                        font-family: 'SF Mono', Monaco, Consolas, 'Courier New', monospace;
                        font-size: 0.9em;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        color: var(--vscode-textLink-foreground);
                    }
                    .icon-btn {
                        background: none;
                        border: none;
                        color: var(--vscode-foreground);
                        cursor: pointer;
                        padding: 4px;
                        border-radius: 4px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .icon-btn:hover {
                        background: var(--item-hover);
                    }
                    .btn-primary {
                        background: var(--accent);
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 8px;
                        cursor: pointer;
                        width: 100%;
                        font-size: 0.9em;
                        font-weight: 600;
                        transition: all 0.2s;
                    }
                    .btn-primary:hover {
                        background: var(--accent-hover);
                        box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
                    }
                    .message-list {
                        flex-grow: 1;
                        overflow-y: auto;
                        padding: 12px;
                    }
                    .message-item {
                        padding: 14px;
                        background: var(--card-bg);
                        border-radius: var(--border-radius);
                        margin-bottom: 10px;
                        cursor: pointer;
                        transition: all 0.2s;
                        border: 1px solid transparent;
                    }
                    .message-item:hover {
                        border-color: var(--vscode-focusBorder);
                        transform: translateX(2px);
                    }
                    .message-subject {
                        font-weight: 700;
                        margin-bottom: 6px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .message-info {
                        display: flex;
                        justify-content: space-between;
                        font-size: 0.8em;
                        color: var(--text-muted);
                        margin-bottom: 8px;
                    }
                    .message-intro {
                        font-size: 0.85em;
                        color: var(--text-muted);
                        line-height: 1.4;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
                    .empty-state {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 60px 20px;
                        text-align: center;
                        color: var(--text-muted);
                    }
                    .empty-state svg {
                        width: 64px;
                        height: 64px;
                        margin-bottom: 16px;
                        opacity: 0.2;
                    }
                    .loader {
                        width: 20px;
                        height: 20px;
                        border: 3px solid rgba(59, 130, 246, 0.3);
                        border-bottom-color: var(--accent);
                        border-radius: 50%;
                        display: inline-block;
                        animation: rotation 1s linear infinite;
                    }
                    @keyframes rotation {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    .loading-overlay {
                        display: none;
                        position: absolute;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background: rgba(0,0,0,0.4);
                        backdrop-filter: blur(2px);
                        z-index: 100;
                        align-items: center;
                        justify-content: center;
                    }
                    .loading-overlay.visible {
                        display: flex;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div id="loadingOverlay" class="loading-overlay">
                        <span class="loader"></span>
                    </div>

                    <!-- Authorization View -->
                    <div id="authView">
                        <div class="logo-placeholder">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 17a2 2 0 01-2 2H4a2 2 0 01-2-2V9.5C2 7 4 5 6.5 5H18c2.5 0 4.5 2 4.5 4.5V17z"/><path d="M2 9.5l10 6 10-6"/></svg>
                        </div>
                        <h1 class="auth-title">DevMailer</h1>
                        <p class="auth-desc">Test email integrations instantly.<br>Sign in to get started.</p>
                        <button id="loginBtn" class="google-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                            Continue with Google
                        </button>
                    </div>

                    <!-- Main Application View -->
                    <div id="mainView">
                        <div class="header">
                            <div class="user-bar">
                                <div class="user-info">
                                    <img id="userAvatar" class="avatar" src="" style="display:none">
                                    <div id="userAvatarPlace" class="avatar"></div>
                                    <span id="userName" class="username">User</span>
                                </div>
                                <button id="logoutBtn" class="logout-btn">Logout</button>
                            </div>
                            <div class="address-card">
                                <span id="addressDisplay" class="address-text">Generating...</span>
                                <button id="copyBtn" class="icon-btn" title="Copy Address">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 4V1H13L16 4V13H13V16H4V13H1V4H4ZM5 5H2V15H12V12H5V5ZM12.2929 4L10 1.70711V4H12.2929ZM15 12V5H9V1H5V4H9V12H15Z"/></svg>
                                </button>
                            </div>
                            <button id="refreshBtn" class="btn-primary">Refresh Inbox</button>
                        </div>
                        <div id="messageList" class="message-list">
                            <div class="empty-state">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-7.5 7.5-7.5-7.5" /></svg>
                                <p>No messages yet.<br>Waiting for emails to arrive...</p>
                            </div>
                        </div>
                    </div>
                </div>

                <script>
                    const vscode = acquireVsCodeApi();
                    const authView = document.getElementById('authView');
                    const mainView = document.getElementById('mainView');
                    const messageList = document.getElementById('messageList');
                    const addressDisplay = document.getElementById('addressDisplay');
                    const loadingOverlay = document.getElementById('loadingOverlay');
                    const userName = document.getElementById('userName');
                    const userAvatar = document.getElementById('userAvatar');
                    const userAvatarPlace = document.getElementById('userAvatarPlace');

                    document.getElementById('loginBtn').addEventListener('click', () => {
                        vscode.postMessage({ type: 'login' });
                    });

                    document.getElementById('logoutBtn').addEventListener('click', () => {
                        vscode.postMessage({ type: 'logout' });
                    });

                    document.getElementById('refreshBtn').addEventListener('click', () => {
                        vscode.postMessage({ type: 'refresh' });
                    });

                    document.getElementById('copyBtn').addEventListener('click', () => {
                        const address = addressDisplay.textContent;
                        vscode.postMessage({ type: 'copyAddress', address });
                    });

                    window.addEventListener('message', event => {
                        const message = event.data;
                        switch (message.type) {
                            case 'authUpdate':
                                if (message.user) {
                                    authView.style.display = 'none';
                                    mainView.style.display = 'flex';
                                    userName.textContent = message.user.name;
                                    if (message.user.avatar) {
                                        userAvatar.src = message.user.avatar;
                                        userAvatar.style.display = 'block';
                                        userAvatarPlace.style.display = 'none';
                                    }
                                } else {
                                    authView.style.display = 'flex';
                                    mainView.style.display = 'none';
                                }
                                break;
                            case 'update':
                                addressDisplay.textContent = message.address;
                                updateMessages(message.messages);
                                loadingOverlay.classList.toggle('visible', message.loading);
                                break;
                        }
                    });

                    function updateMessages(messages) {
                        if (!messages || messages.length === 0) {
                            messageList.innerHTML = \`
                                <div class="empty-state">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-7.5 7.5-7.5-7.5" /></svg>
                                    <p>No messages yet.<br>Waiting for emails to arrive...</p>
                                </div>\`;
                            return;
                        }

                        messageList.innerHTML = messages.map(msg => \`
                            <div class="message-item" onclick="openMessage('\${msg.id}')">
                                <div class="message-subject">\${msg.subject || '(No Subject)'}</div>
                                <div class="message-info">
                                    <span>\${msg.from.name || msg.from.address.split('@')[0]}</span>
                                    <span>\${new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                                <div class="message-intro">\${msg.intro}</div>
                            </div>
                        \`).join('');
                    }

                    function openMessage(id) {
                        vscode.postMessage({ type: 'openMessage', messageId: id });
                    }
                </script>
            </body>
            </html>`;
    }
}
