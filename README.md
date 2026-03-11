# DevMailer 📧

DevMailer is a VS Code extension designed for developers who need to test email integrations without leaving their IDE. Forget switching to Chrome to check temporary mail services; do it all within VS Code!

## Features

- **Instant Temporary Email**: Get a random `@mail.tm` address immediately upon activation.
- **Auto-Refresh**: Automatically checks for new messages every 15 seconds.
- **Rich HTML Preview**: View emails with their original styling in a dedicated VS Code panel.
- **One-Click Copy**: Copy your temporary address to the clipboard with a single click.
- **Clean UI**: Modern, sleek interface that matches your VS Code theme.

## How to use

1.  **Open the Side Bar**: Click on the DevMailer icon in the Activity Bar.
2.  **Copy Address**: Click the copy icon next to the generated email address.
3.  **Integration**: Paste this address into your code (e.g., using Nodemailer or your backend service).
4.  **Send Email**: Trigger your code to send an email to that address.
5.  **View Results**: The email will appear in the DevMailer list. Click on it to see the full content and styling.

## Commands

- `DevMailer: Refresh Emails` - Manually check for new messages.
- `DevMailer: Generate New Email` - Discard the current address and generate a fresh one.

## Development

To run the extension locally:
1.  Open the project folder in VS Code.
2.  Press `F5` to launch a new Window with the extension enabled.
3.  Go to the Activity Bar and find the DevMailer icon.

---
Built with ❤️ for the developer community.
