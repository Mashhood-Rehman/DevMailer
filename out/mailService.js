"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const axios_1 = __importDefault(require("axios"));
class MailService {
    baseUrl = 'https://api.mail.tm';
    async getDomain() {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/domains`);
            return response.data['hydra:member'][0].domain;
        }
        catch (error) {
            console.error('Error fetching domains:', error);
            throw error;
        }
    }
    async createAccount() {
        // Check/Increment limit on backend
        try {
            const incResponse = await axios_1.default.post('http://localhost:3000/emails/increment');
            if (!incResponse.data.success) {
                throw new Error(incResponse.data.message || 'Limit reached');
            }
        }
        catch (error) {
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
            await axios_1.default.post(`${this.baseUrl}/accounts`, {
                address,
                password
            });
            return { address, password };
        }
        catch (error) {
            console.error('Error creating account:', error);
            throw error;
        }
    }
    async getToken(account) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/token`, {
                address: account.address,
                password: account.password
            });
            return response.data.token;
        }
        catch (error) {
            console.error('Error getting token:', error);
            throw error;
        }
    }
    async getMessages(token) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data['hydra:member'];
        }
        catch (error) {
            console.error('Error getting messages:', error);
            return [];
        }
    }
    async getMessageDetail(id, token) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/messages/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        }
        catch (error) {
            console.error('Error getting message detail:', error);
            throw error;
        }
    }
    async deleteMessage(id, token) {
        try {
            await axios_1.default.delete(`${this.baseUrl}/messages/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        }
        catch (error) {
            console.error('Error deleting message:', error);
        }
    }
    async getAuthStatus() {
        try {
            const response = await axios_1.default.get('http://localhost:3000/auth/status');
            return response.data;
        }
        catch (error) {
            console.error('Error getting auth status:', error);
            return { authenticated: false };
        }
    }
}
exports.MailService = MailService;
//# sourceMappingURL=mailService.js.map