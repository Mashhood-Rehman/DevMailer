const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const crypto = require('crypto');
const axios = require('axios');

const prisma = new PrismaClient();
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;

// CORS - allow extension and website
const allowedOrigins = [
    'http://localhost:5173', 
    'vscode-webview://*',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

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
const callbackURL = process.env.BACKEND_URL 
    ? `${process.env.BACKEND_URL}/auth/google/callback`
    : `http://localhost:${PORT}/auth/google/callback`;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL
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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // true if https
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// Use express.json but save the raw body to req.rawBody for webhook verification
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));

// Health Check for Render
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Auth Routes
app.get('/auth/google', (req, res, next) => {
    const { scheme = 'vscode', extensionId = 'prime-laptops.devmailer', redirect } = req.query;
    
    // Pass scheme, extensionId, and optional redirect in state
    const state = JSON.stringify({ scheme, extensionId, redirect });
    
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account',
        state: state
    })(req, res, next);
});

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        let scheme = 'vscode';
        let extensionId = 'prime-laptops.devmailer';
        let redirect = null;

        try {
            if (req.query.state) {
                const stateObj = JSON.parse(req.query.state);
                scheme = stateObj.scheme || 'vscode';
                extensionId = stateObj.extensionId || 'prime-laptops.devmailer';
                redirect = stateObj.redirect;
            }
        } catch (e) {
            console.error('Failed to parse state:', e);
        }

        // If a redirect URL was provided (website login), go there immediately
        if (redirect) {
            return res.redirect(redirect);
        }

        // Otherwise, show the VS Code success page
        const user = {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            avatar: req.user.avatar,
            emailsSentToday: req.user.emailsSentToday,
            lastResetDate: req.user.lastResetDate
        };
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

    const limit = user.tier === 'PREMIUM' ? 50 : 10;
    const now = new Date();
    const lastReset = new Date(user.lastResetDate);

    // Reset if it's a new day
    const isNewDay = now.toDateString() !== lastReset.toDateString();

    if (isNewDay) {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                emailsSentToday: 0,
                lastResetDate: now
            }
        });
        return { user: updatedUser, limit };
    }

    return { user, limit };
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
        const { user, limit } = await checkDailyLimit(req.user.id);

        if (user.emailsSentToday >= limit) {
            return res.status(429).json({
                error: 'Daily limit reached',
                message: `You can only send ${limit} emails per day on ${user.tier} tier.`
            });
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { emailsSentToday: user.emailsSentToday + 1 }
        });

        res.json({ success: true, emailsSentToday: updatedUser.emailsSentToday, limit });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- Lemon Squeezy Routes ---

app.post('/payments/create-checkout', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const response = await axios.post('https://api.lemonsqueezy.com/v1/checkouts', {
            data: {
                type: "checkouts",
                attributes: {
                    checkout_data: {
                        email: req.user.email,
                        custom: {
                            user_id: req.user.id
                        }
                    }
                },
                relationships: {
                    store: {
                        data: {
                            type: "stores",
                            id: process.env.LEMONSQUEEZY_STORE_ID
                        }
                    },
                    variant: {
                        data: {
                            type: "variants",
                            id: process.env.LEMONSQUEEZY_VARIANT_ID // Your plan ID
                        }
                    }
                }
            }
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json'
            }
        });

    // Lemon Squeezy returns the checkout url in this path:
        res.json({ url: response.data.data.attributes.url });
    } catch (error) {
        console.error('Lemon Squeezy Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

app.get('/payments/customer-portal', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Lemon Squeezy Customer Portal is typically at your store's billing URL
    // You can find this in your Lemon Squeezy Dashboard -> Settings -> Customer Portal
    const portalUrl = process.env.LEMONSQUEEZY_BILLING_URL;
    
    if (!portalUrl) {
        return res.status(500).json({ error: 'Billing URL not configured' });
    }
    
    // We can append the email to pre-fill it if needed
    const redirectUrl = `${portalUrl}?email=${encodeURIComponent(req.user.email)}`;
    
    res.json({ url: redirectUrl });
});

// Lemon Squeezy Webhook
app.post('/payments/webhook', async (req, res) => {
    // We already use express.json(), but we need to verify with rawBody
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    const signature = req.headers['x-signature'];

    // Verify signature to make sure it's actually Lemon Squeezy
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(req.rawBody).digest('hex'), 'utf8');
    const signatureBuffer = Buffer.from(signature || '', 'utf8');

    if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
        return res.status(401).send('Invalid signature');
    }

    try {
        const payload = req.body;
        const eventName = payload.meta.event_name;

        // Listen for new orders / subscriptions
        if (eventName === 'order_created' || eventName === 'subscription_created' || eventName === 'subscription_updated') {
            const customData = payload.meta.custom_data;
            const customerId = payload.data.attributes.customer_id.toString();
            const status = payload.data.attributes.status;

            // If it's an update, check if it's still active
            const isPremium = !status || ['active', 'on_trial'].includes(status);

            if (customData && customData.user_id) {
                await prisma.user.update({
                    where: { id: customData.user_id },
                    data: {
                        tier: isPremium ? 'PREMIUM' : 'FREE',
                        lemonSqueezyId: customerId
                    }
                });
                console.log(`Updated user ${customData.user_id} tier to ${isPremium ? 'PREMIUM' : 'FREE'} via LS webhook.`);
            }
        }

        // Handle cancellations
        if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
            const customData = payload.meta.custom_data;
            if (customData && customData.user_id) {
                await prisma.user.update({
                    where: { id: customData.user_id },
                    data: { tier: 'FREE' }
                });
                console.log(`Revoked PREMIUM for user ${customData.user_id} due to cancellation/expiry.`);
            }
        }
    } catch (err) {
        console.error("Webhook processing error:", err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    res.json({ received: true });
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