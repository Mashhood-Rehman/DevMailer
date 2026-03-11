const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

// Passport Serialization
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Passport Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${PORT}/auth/google/callback`
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await prisma.user.findUnique({
                where: { googleId: profile.id }
            });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        googleId: profile.id,
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        avatar: profile.photos[0].value,
                        lastLoginAt: new Date()
                    }
                });
            } else {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { lastLoginAt: new Date() }
                });
            }
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
));

// Middlewares
app.use(session({
    secret: process.env.SESSION_SECRET || 'devmailer-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using https
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// Auth Routes
app.get('/auth/google', (req, res, next) => {
    const scheme = req.query.scheme || 'vscode';
    const extensionId = req.query.extensionId || 'prime-laptops.devmailer';
    console.log(`Auth started with scheme: ${scheme}, extension: ${extensionId}`);
    
    // Pass both scheme and extensionId in state
    const state = JSON.stringify({ scheme, extensionId });
    
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        prompt: 'select_account',
        state: state
    })(req, res, next);
});

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication
        const user = {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            avatar: req.user.avatar,
            emailsSentToday: req.user.emailsSentToday,
            lastResetDate: req.user.lastResetDate
        };

        // Parse state
        let scheme = 'vscode';
        let extensionId = 'prime-laptops.devmailer';
        try {
            if (req.query.state) {
                const state = JSON.parse(req.query.state);
                scheme = state.scheme || 'vscode';
                extensionId = state.extensionId || 'prime-laptops.devmailer';
            }
        } catch (e) {
            console.error('Failed to parse state:', e);
        }

        const userJson = JSON.stringify(user);
        const vscodeUri = `${scheme}://${extensionId}/auth-complete?user=${encodeURIComponent(userJson)}`;
        const manualToken = Buffer.from(userJson).toString('base64');

        const schemeName = scheme === 'vscode' ? 'VS Code' : (scheme.charAt(0).toUpperCase() + scheme.slice(1));

        res.send(`
      <html>
        <head>
          <title>Authentication Successful</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: #0f172a; color: white; margin: 0; padding: 20px; text-align: center; }
            h1 { color: #60a5fa; margin-bottom: 5px; }
            .card { background: #1e293b; padding: 30px; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); max-width: 450px; width: 100%; border: 1px solid #334155; }
            .btn { display: inline-block; background: #3b82f6; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin-top: 20px; transition: background 0.2s; border: none; cursor: pointer; }
            .btn:hover { background: #2563eb; }
            .fallback { margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155; font-size: 0.9em; color: #94a3b8; }
            .token-box { background: #0f172a; padding: 10px; border-radius: 6px; margin: 10px 0; font-family: monospace; word-break: break-all; font-size: 0.8em; border: 1px solid #334155; color: #38bdf8; position: relative; }
            .copy-badge { position: absolute; top: 5px; right: 5px; background: #334155; font-size: 10px; padding: 2px 5px; border-radius: 3px; cursor: pointer; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Success!</h1>
            <p>Authentication was successful. Content is being sent back to ${schemeName}.</p>
            
            <a href="${vscodeUri}" class="btn" id="redirectBtn">Return to ${schemeName}</a>
            
            <div class="fallback">
              <p>Still stuck? Copy the code below and use the "Manual Auth" command in ${schemeName}.</p>
              <div class="token-box">
                <span id="tokenText">${manualToken}</span>
                <span class="copy-badge" onclick="copyToken()">Copy Code</span>
              </div>
              <p style="font-size: 0.8em;">In ${schemeName}, press <b>Cmd+Shift+P</b> (or Ctrl+Shift+P) and type "Manual Auth".</p>
            </div>
          </div>

          <script>
            function copyToken() {
              const token = document.getElementById('tokenText').innerText;
              navigator.clipboard.writeText(token);
              const badge = document.querySelector('.copy-badge');
              badge.innerText = 'Copied!';
              setTimeout(() => badge.innerText = 'Copy Code', 2000);
            }

            console.log("Redirecting to: ${vscodeUri}");
            // Automatic redirect attempt
            setTimeout(() => {
                window.location.href = "${vscodeUri}";
            }, 500);
          </script>
        </body>
      </html>
    `);
    });

// Helper to check and reset daily email limit
async function checkDailyLimit(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;

    const now = new Date();
    const lastReset = new Date(user.lastResetDate);

    // Reset if it's a new day
    const isNewDay = now.toDateString() !== lastReset.toDateString();

    if (isNewDay) {
        return await prisma.user.update({
            where: { id: userId },
            data: {
                emailsSentToday: 0,
                lastResetDate: now
            }
        });
    }

    return user;
}

app.get('/auth/status', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const user = await checkDailyLimit(req.user.id);
            res.json({ authenticated: true, user });
        } catch (error) {
            res.status(500).json({ error: 'Failed to check status' });
        }
    } else {
        res.json({ authenticated: false });
    }
});

app.post('/emails/increment', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const user = await checkDailyLimit(req.user.id);
        
        if (user.emailsSentToday >= 10) {
            return res.status(429).json({ 
                error: 'Daily limit reached', 
                message: 'You can only send 10 emails per day.' 
            });
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { emailsSentToday: user.emailsSentToday + 1 }
        });

        res.json({ success: true, emailsSentToday: updatedUser.emailsSentToday });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: 'Logout failed' });
        res.json({ message: 'Logged out' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
