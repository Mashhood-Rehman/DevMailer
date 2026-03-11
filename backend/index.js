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
                        avatar: profile.photos[0].value
                    }
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
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication
        const user = {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            avatar: req.user.avatar
        };

        // Redirect back to VS Code using custom URI scheme
        // format: vscode://<publisher>.<extension-name>/<path>?<params>
        const vscodeUri = `vscode://prime-laptops.devmailer/auth-complete?user=${encodeURIComponent(JSON.stringify(user))}`;

        res.send(`
      <html>
        <body style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #0f172a; color: white;">
          <h1 style="color: #60a5fa;">Authentication Successful!</h1>
          <p>Redirecting you back to VS Code...</p>
          <script>
            window.location.href = "${vscodeUri}";
            setTimeout(() => {
              window.close();
            }, 5000);
          </script>
        </body>
      </html>
    `);
    });

app.get('/auth/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.json({ authenticated: false });
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
