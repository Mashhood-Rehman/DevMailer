# DevMailer Progress Tracker 🚀

Track the development progress, current workflow, and upcoming tasks for DevMailer.

---

## ⚡ Current Workflow

1.  **Extension Activation**: DevMailer initializes and attempts to restore the user session and temporary email account from VS Code's `globalState`.
2.  **Authentication**:
    - **Google Login**: Users click "Continue with Google" in the sidebar, which opens a browser for OAuth.
    - **Automatic Redirect**: The backend (`localhost:3000`) uses the `vscode.window.registerUriHandler` to seamlessly send auth data back to the extension using `vscode://` URIs.
    - **Manual Fallback**: If the redirect fails, users can copy-paste a base64 encoded token from the success page.
3.  **Account Generation**:
    - **Limit Check**: Before generating a new email, the extension calls the backend (`/emails/increment`) to verify the daily limit (10 for Free, 50 for Premium).
    - **@mail.tm Integration**: Once verified, a new account is created using the Mail.tm API.
4.  **Email Management**:
    - **Polling**: The extension polls `@mail.tm` every 15 seconds for new messages (configurable in settings).
    - **Inbox View**: Messages are listed in the VS Code sidebar with subject, sender, and snippet. Hover to delete individual messages.
    - **Rich Preview**: Clicking a message opens a dedicated VS Code editor panel rendering the full HTML content.
5.  **Premium Workflow**:
    - **Daily Reset**: The backend automatically resets the `emailsSentToday` count every 24 hours.
    - **Payment Sync**: Lemon Squeezy webhooks are integrated to upgrade user tiers to `PREMIUM` upon successful payment.

---

## ✅ Functionalities Added (Done)

### **Core Extension & UI**
- [x] **Side Bar Activity Bar Icon**: Dedicated view for quick access.
- [x] **Webview-based Sidebar**: Modern, responsive UI matching VS Code themes.
- [x] **Rich HTML Viewer**: Full email rendering in a side panel.
- [x] **Message Deletion**: Users can delete emails from the sidebar with a trash icon hover.
- [x] **Status Bar Integration**: Current email address is always visible in the VS Code status bar.
- [x] **Customizable Polling**: Users can toggle auto-refresh and set custom intervals in VS Code settings.
- [x] **Onboarding Workflow**: First-launch guide and welcome notification for new users.

### **Authentication & Backend**
- [x] **Google OAuth 2.0**: Secure login flow for both website and extension.
- [x] **Automatic Redirect**: Backend recognizes website vs extension logins for seamless redirection.
- [x] **Daily Limit Logic**: Enforced tracking of daily email generation usage.
- [x] **Lemon Squeezy Integration**: Webhook handling for user tier upgrades.

### **Website & Dashboard**
- [x] **Main Landing Page**: Marketing content and pricing sections.
- [x] **User Account Dashboard**: Stunning web view for users to check tier, usage, and profile details at `localhost:5173`.
- [x] **Auth Sync**: Website dashboard correctly reflects the logged-in user's stats from the backend.

---

## 🚧 Undone / Next Steps

### **High Priority**
- [ ] **Deployment**: Migrate the backend and database from `localhost:3000` to a production environment (e.g., Railway, Vercel).
- [ ] **Search Functionality**: Add a search bar to the sidebar to filter through received emails.
- [ ] **Email Attachments**: Support for downloading attachments directly from the VS Code viewer.

### **Enhancements**
- [ ] **Dark/Light Mode Sync**: Ensure the website theme perfectly matches the user's system preferences.
- [ ] **Full Documentation**: Complete the `/docs` section on the website with setup and API guides.
