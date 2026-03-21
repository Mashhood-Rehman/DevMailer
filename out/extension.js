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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const mailService_1 = require("./mailService");
const DevMailerPanel_1 = require("./DevMailerPanel");
async function activate(context) {
    console.log('DevMailer is now active!');
    const mailService = new mailService_1.MailService();
    const provider = new DevMailerPanel_1.DevMailerPanel(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(DevMailerPanel_1.DevMailerPanel.viewType, provider));
    // Welcome Onboarding
    const isFirstLaunch = context.globalState.get('isFirstLaunch', true);
    if (isFirstLaunch) {
        vscode.window.showInformationMessage('Welcome to DevMailer! 📧 Your all-in-one email testing companion for VS Code.', 'Get Started', 'Learn More').then(selection => {
            if (selection === 'Get Started') {
                vscode.commands.executeCommand('devmailer-explorer.focus');
                vscode.window.showInformationMessage('Step 1: Click "Generate Temporary Email" in the sidebar to get started!');
            }
            else if (selection === 'Learn More') {
                vscode.env.openExternal(vscode.Uri.parse('https://github.com/Mashhood-Rehman/DevMailer'));
            }
        });
        context.globalState.update('isFirstLaunch', false);
    }
    let currentAccount = context.globalState.get('mailAccount');
    let token = context.globalState.get('mailToken');
    let user = context.globalState.get('user');
    // Create Status Bar Item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'devmailer-explorer.focus';
    statusBarItem.tooltip = 'DevMailer: Current Temporary Email';
    context.subscriptions.push(statusBarItem);
    const updateStatusBar = () => {
        if (currentAccount) {
            statusBarItem.text = `$(mail) ${currentAccount.address}`;
            statusBarItem.show();
        }
        else {
            statusBarItem.hide();
        }
    };
    const updateView = async (showLoading = false) => {
        if (!user) {
            provider.updateAuthState(null);
            return;
        }
        try {
            const status = await mailService.getAuthStatus();
            if (status.authenticated) {
                user = status.user;
                context.globalState.update('user', user);
            }
        }
        catch (e) {
            console.error('Failed to fetch latest user status:', e);
        }
        provider.updateAuthState(user);
        if (!currentAccount || !token) {
            statusBarItem.hide();
            await initializeAccount();
            return;
        }
        updateStatusBar();
        try {
            provider.updateState(currentAccount.address, [], showLoading);
            const messages = await mailService.getMessages(token);
            provider.updateState(currentAccount.address, messages, false);
        }
        catch (error) {
            console.error('Failed to update messages:', error);
            await refreshToken();
        }
    };
    // URI Handler for Auth Callback
    const uriHandler = vscode.window.registerUriHandler({
        handleUri(uri) {
            console.log(`[DevMailer] Received URI: ${uri.toString()}`);
            console.log(`[DevMailer] URI Path: ${uri.path}`);
            console.log(`[DevMailer] URI Authority: ${uri.authority}`);
            // Support both /auth-complete and auth-complete
            if (uri.path.includes('auth-complete')) {
                const queryParams = new URLSearchParams(uri.query);
                const userParam = queryParams.get('user');
                if (userParam) {
                    try {
                        const userData = JSON.parse(decodeURIComponent(userParam));
                        console.log(`[DevMailer] Auth successful for user: ${userData.email}`);
                        user = userData;
                        context.globalState.update('user', userData);
                        vscode.window.showInformationMessage(`Welcome, ${userData.name}!`);
                        updateView();
                    }
                    catch (e) {
                        console.error('[DevMailer] Failed to parse user data:', e);
                        vscode.window.showErrorMessage('Failed to parse authentication data.');
                    }
                }
            }
        }
    });
    context.subscriptions.push(uriHandler);
    const initializeAccount = async () => {
        if (!user)
            return;
        try {
            provider.updateState('Generating...', [], true);
            const account = await mailService.createAccount();
            const newToken = await mailService.getToken(account);
            currentAccount = account;
            token = newToken;
            await context.globalState.update('mailAccount', account);
            await context.globalState.update('mailToken', newToken);
            updateView();
        }
        catch (error) {
            vscode.window.showErrorMessage('Failed to generate temporary email.');
        }
    };
    const refreshToken = async () => {
        if (currentAccount) {
            try {
                const newToken = await mailService.getToken(currentAccount);
                token = newToken;
                await context.globalState.update('mailToken', newToken);
                await updateView();
            }
            catch (error) {
                await initializeAccount();
            }
        }
    };
    // Management for dynamic interval
    let pollInterval;
    const startPolling = () => {
        if (pollInterval) {
            clearInterval(pollInterval);
        }
        const config = vscode.workspace.getConfiguration('devmailer');
        const autoRefresh = config.get('autoRefresh', true);
        const intervalSec = Math.max(config.get('refreshInterval', 15), 5); // Minimum 5s
        if (autoRefresh) {
            console.log(`[DevMailer] Starting auto-refresh every ${intervalSec}s`);
            pollInterval = setInterval(() => updateView(), intervalSec * 1000);
        }
    };
    context.subscriptions.push({ dispose: () => { if (pollInterval) {
            clearInterval(pollInterval);
        } } });
    // Listen for config changes
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('devmailer.autoRefresh') || e.affectsConfiguration('devmailer.refreshInterval')) {
            startPolling();
        }
    }));
    startPolling();
    context.subscriptions.push(vscode.commands.registerCommand('devmailer.login', () => {
        const scheme = vscode.env.uriScheme || 'vscode';
        const extensionId = context.extension.id;
        console.log(`[DevMailer] Initiating login with scheme: ${scheme}, extension: ${extensionId}`);
        vscode.env.openExternal(vscode.Uri.parse(`http://localhost:3000/auth/google?scheme=${scheme}&extensionId=${extensionId}`));
    }), vscode.commands.registerCommand('devmailer.manualAuth', async () => {
        const input = await vscode.window.showInputBox({
            prompt: 'Paste the authentication token from your browser',
            placeHolder: 'Paste the token here...'
        });
        if (input) {
            try {
                // Expecting base64 encoded user JSON
                const userData = JSON.parse(Buffer.from(input, 'base64').toString('utf8'));
                user = userData;
                await context.globalState.update('user', userData);
                vscode.window.showInformationMessage(`Welcome, ${userData.name}!`);
                updateView();
            }
            catch (e) {
                vscode.window.showErrorMessage('Invalid authentication token. Make sure you copied the correct code.');
            }
        }
    }), vscode.commands.registerCommand('devmailer.logout', async () => {
        user = undefined;
        currentAccount = undefined;
        token = undefined;
        await context.globalState.update('user', undefined);
        await context.globalState.update('mailAccount', undefined);
        await context.globalState.update('mailToken', undefined);
        updateView();
    }), vscode.commands.registerCommand('devmailer.refresh', () => updateView(true)), vscode.commands.registerCommand('devmailer.generateNew', async () => {
        const confirmed = await vscode.window.showWarningMessage('Generate a new temporary email? Current address and messages will be lost.', { modal: true }, 'Generate New');
        if (confirmed === 'Generate New') {
            await initializeAccount();
        }
    }), vscode.commands.registerCommand('devmailer.openMessage', async (messageId) => {
        if (!token) {
            return;
        }
        try {
            const message = await mailService.getMessageDetail(messageId, token);
            const panel = vscode.window.createWebviewPanel('messageDetail', message.subject || 'Message Detail', vscode.ViewColumn.One, { enableScripts: true });
            panel.webview.html = `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <style>
                            body { 
                                background-color: white; 
                                color: black; 
                                padding: 20px; 
                                font-family: sans-serif;
                            }
                            .header {
                                margin-bottom: 20px;
                                border-bottom: 1px solid #eee;
                                padding-bottom: 10px;
                                color: #333;
                            }
                            .subject { font-size: 1.5em; font-weight: bold; margin-bottom: 5px; }
                            .meta { font-size: 0.9em; color: #666; }
                            .content { line-height: 1.5; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <div class="subject">${message.subject || '(No Subject)'}</div>
                            <div class="meta">From: ${message.from.name} &lt;${message.from.address}&gt;</div>
                            <div class="meta">Date: ${new Date(message.createdAt).toLocaleString()}</div>
                        </div>
                        <div class="content">
                            ${message.html ? message.html[0] : (message.text || 'No content')}
                        </div>
                    </body>
                    </html>`;
        }
        catch (error) {
            vscode.window.showErrorMessage('Failed to load message details.');
        }
    }), vscode.commands.registerCommand('devmailer.deleteMessage', async (messageId) => {
        if (!token) {
            return;
        }
        try {
            await mailService.deleteMessage(messageId, token);
            vscode.window.showInformationMessage('Message deleted.');
            updateView();
        }
        catch (error) {
            vscode.window.showErrorMessage('Failed to delete message.');
        }
    }));
    // Initial load
    updateView();
}
function deactivate() { }
//# sourceMappingURL=extension.js.map