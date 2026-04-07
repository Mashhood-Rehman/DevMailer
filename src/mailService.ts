import axios from 'axios';
import * as vscode from 'vscode';

export interface MailAccount {
    address: string;
    token: string;
}

export interface MailMessage {
    id: string;
    from: {
        address: string;
        name: string;
    };
    subject: string;
    intro: string;
    createdAt: string;
    html?: string[];
    text?: string;
}

export class MailService {
    private readonly baseUrl = 'https://api.mail.tm';

    private getBackendUrl(): string {
        const config = vscode.workspace.getConfiguration('devmailer');
        return config.get<string>('backendUrl', 'http://localhost:3000');
    }

    async getDomain(): Promise<string> {
        try {
            const response = await axios.get(`${this.baseUrl}/domains`);
            return response.data['hydra:member'][0].domain;
        } catch (error) {
            console.error('Error fetching domains:', error);
            throw error;
        }
    }

    async createAccount(): Promise<{ address: string; password: string }> {
        // Check/Increment limit on backend
        try {
            const backendUrl = this.getBackendUrl();
            const incResponse = await axios.post(`${backendUrl}/emails/increment`);
            if (!incResponse.data.success) {
                throw new Error(incResponse.data.message || 'Limit reached');
            }
        } catch (error: any) {
            if (error.response && error.response.status === 429) {
                throw new Error(error.response.data.message || 'Daily limit reached');
            }
            console.error('Limit check failed:', error);
            // If backend is down, we might want to still allow it or block it. 
            // For now, let's assume backend is required for tracking.
            throw new Error('Could not verify daily limit with server.');
        }

        const domain = await this.getDomain();
        const username = Math.random().toString(36).substring(2, 12);
        const password = Math.random().toString(36).substring(2, 12);
        const address = `${username}@${domain}`;

        try {
            await axios.post(`${this.baseUrl}/accounts`, {
                address,
                password
            });
            return { address, password };
        } catch (error) {
            console.error('Error creating account:', error);
            throw error;
        }
    }

    async getToken(account: { address: string; password: string }): Promise<string> {
        try {
            const response = await axios.post(`${this.baseUrl}/token`, {
                address: account.address,
                password: account.password
            });
            return response.data.token;
        } catch (error) {
            console.error('Error getting token:', error);
            throw error;
        }
    }

    async getMessages(token: string): Promise<MailMessage[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data['hydra:member'];
        } catch (error) {
            console.error('Error getting messages:', error);
            return [];
        }
    }

    async getMessageDetail(id: string, token: string): Promise<MailMessage> {
        try {
            const response = await axios.get(`${this.baseUrl}/messages/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting message detail:', error);
            throw error;
        }
    }

    async deleteMessage(id: string, token: string): Promise<void> {
        try {
            await axios.delete(`${this.baseUrl}/messages/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    }

    async getAuthStatus(): Promise<any> {
        try {
            const backendUrl = this.getBackendUrl();
            const response = await axios.get(`${backendUrl}/auth/status`);
            return response.data;
        } catch (error) {
            console.error('Error getting auth status:', error);
            return { authenticated: false };
        }
    }
}
