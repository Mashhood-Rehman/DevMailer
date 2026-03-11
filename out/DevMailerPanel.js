"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevMailerPanel = void 0;
const vscode = __importStar(require("vscode"));
class DevMailerPanel {
    _extensionUri;
    static viewType = 'devmailer-view';
    _view;
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
        console.log('DevMailer Webview resolving...');
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.type) {
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
    updateState(address, messages, loading = false) {
        if (this._view) {
            this._view.webview.postMessage({
                type: 'update',
                address,
                messages,
                loading
            });
        }
    }
    _getHtmlForWebview(webview) {
        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    :root {
                        --padding: 12px;
                        --border-radius: 8px;
                        --bg-secondary: var(--vscode-sideBar-background);
                        --item-hover: var(--vscode-list-hoverBackground);
                        --text-muted: var(--vscode-descriptionForeground);
                        --accent: var(--vscode-button-background);
                        --accent-hover: var(--vscode-button-hoverBackground);
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
                    }
                    .header {
                        padding: var(--padding);
                        border-bottom: 1px solid var(--vscode-divider);
                        background-color: var(--vscode-sideBar-background);
                        z-index: 10;
                    }
                    .address-card {
                        background: var(--vscode-editor-background);
                        padding: 10px;
                        border-radius: var(--border-radius);
                        margin-bottom: 10px;
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
                        color: var(--vscode-button-foreground);
                        border: none;
                        padding: 6px 12px;
                        border-radius: 4px;
                        cursor: pointer;
                        width: 100%;
                        font-size: 0.9em;
                        font-weight: 600;
                        transition: background 0.2s;
                    }
                    .btn-primary:hover {
                        background: var(--accent-hover);
                    }
                    .message-list {
                        flex-grow: 1;
                        overflow-y: auto;
                        padding: 8px;
                    }
                    .message-item {
                        padding: 10px;
                        border-radius: var(--border-radius);
                        margin-bottom: 6px;
                        cursor: pointer;
                        transition: background 0.2s;
                        border-left: 3px solid transparent;
                    }
                    .message-item:hover {
                        background: var(--item-hover);
                    }
                    .message-item.new {
                        border-left-color: var(--vscode-textLink-foreground);
                    }
                    .message-subject {
                        font-weight: 600;
                        margin-bottom: 4px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .message-info {
                        display: flex;
                        justify-content: space-between;
                        font-size: 0.8em;
                        color: var(--text-muted);
                    }
                    .message-intro {
                        font-size: 0.85em;
                        color: var(--text-muted);
                        margin-top: 4px;
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
                        padding: 40px 20px;
                        text-align: center;
                        color: var(--text-muted);
                        opacity: 0.7;
                    }
                    .empty-state svg {
                        width: 48px;
                        height: 48px;
                        margin-bottom: 16px;
                    }
                    .loader {
                        width: 16px;
                        height: 16px;
                        border: 2px solid var(--text-muted);
                        border-bottom-color: transparent;
                        border-radius: 50%;
                        display: inline-block;
                        box-sizing: border-box;
                        animation: rotation 1s linear infinite;
                        margin-right: 8px;
                    }
                    @keyframes rotation {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    .loading-overlay {
                        display: none;
                        position: absolute;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background: rgba(0,0,0,0.2);
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
                    <div class="header">
                        <div class="address-card">
                            <span id="addressDisplay" class="address-text">Generating...</span>
                            <button id="copyBtn" class="icon-btn" title="Copy Address">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 4V1H13L16 4V13H13V16H4V13H1V4H4ZM5 5H2V15H12V12H5V5ZM12.2929 4L10 1.70711V4H12.2929ZM15 12V5H9V1H5V4H9V12H15Z"/></svg>
                            </button>
                        </div>
                        <button id="refreshBtn" class="btn-primary">Refresh Messages</button>
                    </div>
                    <div id="messageList" class="message-list">
                        <div class="empty-state">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-7.5 7.5-7.5-7.5" /></svg>
                            <p>No messages yet.<br>Waiting for emails to arrive...</p>
                        </div>
                    </div>
                </div>

                <script>
                    const vscode = acquireVsCodeApi();
                    const messageList = document.getElementById('messageList');
                    const addressDisplay = document.getElementById('addressDisplay');
                    const loadingOverlay = document.getElementById('loadingOverlay');

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
exports.DevMailerPanel = DevMailerPanel;
//# sourceMappingURL=DevMailerPanel.js.map