import * as vscode from 'vscode';
import { MailService, MailAccount, MailMessage } from './mailService';
import { DevMailerPanel } from './DevMailerPanel';

export async function activate(context: vscode.ExtensionContext) {
    console.log('DevMailer is now active!');
    const mailService = new MailService();
    const provider = new DevMailerPanel(context.extensionUri);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(DevMailerPanel.viewType, provider)
    );

    let currentAccount = context.globalState.get<{ address: string; password: string }>('mailAccount');
    let token = context.globalState.get<string>('mailToken');
    let user = context.globalState.get<{ id: string, name: string, email: string, avatar?: string }>('user');

    const updateView = async (showLoading = false) => {
        if (!user) {
            provider.updateAuthState(null);
            return;
        }

        provider.updateAuthState(user);

        if (!currentAccount || !token) {
            await initializeAccount();
            return;
        }
        try {
            provider.updateState(currentAccount.address, [], showLoading);
            const messages = await mailService.getMessages(token);
            provider.updateState(currentAccount.address, messages, false);
        } catch (error) {
            console.error('Failed to update messages:', error);
            await refreshToken();
        }
    };

    // URI Handler for Auth Callback
    const uriHandler = vscode.window.registerUriHandler({
        handleUri(uri: vscode.Uri): vscode.ProviderResult<void> {
            if (uri.path === '/auth-complete') {
                const queryParams = new URLSearchParams(uri.query);
                const userParam = queryParams.get('user');
                if (userParam) {
                    try {
                        const userData = JSON.parse(decodeURIComponent(userParam));
                        user = userData;
                        context.globalState.update('user', userData);
                        vscode.window.showInformationMessage(`Welcome, ${userData.name}!`);
                        updateView();
                    } catch (e) {
                        vscode.window.showErrorMessage('Failed to parse authentication data.');
                    }
                }
            }
        }
    });
    context.subscriptions.push(uriHandler);

    const initializeAccount = async () => {
        if (!user) return;
        try {
            provider.updateState('Generating...', [], true);
            const account = await mailService.createAccount();
            const newToken = await mailService.getToken(account);

            currentAccount = account;
            token = newToken;

            await context.globalState.update('mailAccount', account);
            await context.globalState.update('mailToken', newToken);

            updateView();
        } catch (error) {
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
            } catch (error) {
                await initializeAccount();
            }
        }
    };

    // Auto update every 15 seconds
    const interval = setInterval(() => updateView(), 15000);
    context.subscriptions.push({ dispose: () => clearInterval(interval) });

    context.subscriptions.push(
        vscode.commands.registerCommand('devmailer.login', () => {
            vscode.env.openExternal(vscode.Uri.parse('http://localhost:3000/auth/google'));
        }),
        vscode.commands.registerCommand('devmailer.logout', async () => {
            user = undefined;
            currentAccount = undefined;
            token = undefined;
            await context.globalState.update('user', undefined);
            await context.globalState.update('mailAccount', undefined);
            await context.globalState.update('mailToken', undefined);
            updateView();
        }),
        vscode.commands.registerCommand('devmailer.refresh', () => updateView(true)),
        vscode.commands.registerCommand('devmailer.generateNew', async () => {
            const confirmed = await vscode.window.showWarningMessage(
                'Generate a new temporary email? Current address and messages will be lost.',
                { modal: true },
                'Generate New'
            );
            if (confirmed === 'Generate New') {
                await initializeAccount();
            }
        }),
        vscode.commands.registerCommand('devmailer.openMessage', async (messageId: string) => {
            if (!token) { return; }

            try {
                const message = await mailService.getMessageDetail(messageId, token);
                const panel = vscode.window.createWebviewPanel(
                    'messageDetail',
                    message.subject || 'Message Detail',
                    vscode.ViewColumn.One,
                    { enableScripts: true }
                );

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
            } catch (error) {
                vscode.window.showErrorMessage('Failed to load message details.');
            }
        })
    );

    // Initial load
    updateView();
}

export function deactivate() { }
