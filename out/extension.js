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
    let currentAccount = context.globalState.get('mailAccount');
    let token = context.globalState.get('mailToken');
    const updateView = async (showLoading = false) => {
        if (!currentAccount || !token) {
            await initializeAccount();
            return;
        }
        try {
            provider.updateState(currentAccount.address, [], showLoading);
            const messages = await mailService.getMessages(token);
            provider.updateState(currentAccount.address, messages, false);
        }
        catch (error) {
            console.error('Failed to update messages:', error);
            // Token might be expired
            await refreshToken();
        }
    };
    const initializeAccount = async () => {
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
    // Auto update every 15 seconds
    const interval = setInterval(() => updateView(), 15000);
    context.subscriptions.push({ dispose: () => clearInterval(interval) });
    context.subscriptions.push(vscode.commands.registerCommand('devmailer.refresh', () => updateView(true)), vscode.commands.registerCommand('devmailer.generateNew', async () => {
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
    }));
    // Initial load
    updateView();
}
function deactivate() { }
//# sourceMappingURL=extension.js.map