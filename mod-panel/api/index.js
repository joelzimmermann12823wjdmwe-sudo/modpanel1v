// api/index.js
require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path'); // Wichtig für die Pfadbehandlung des Frontends

const { init: initBot } = require('../bot/client');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const API_PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cookieParser()); 

// --- 1. Statische Dateien des Frontends ausliefern ---

// Der Pfad zum gebauten Frontend-Verzeichnis (mod-panel/dashboard/dist)
const frontendPath = path.join(__dirname, '..', 'dashboard', 'dist');

// Erlaubt Express, alle statischen Dateien (JS, CSS, Bilder) aus dem Frontend-Build-Ordner auszuliefern
app.use(express.static(frontendPath));

// --- 2. API- und Auth-Routen einbinden ---

const moderationRoutes = require('./routes/moderation');
const authRoutes = require('./routes/auth');

// Prefix für die API-Endpunkte
app.use('/api/mod', moderationRoutes); 
// Prefix für den OAuth2-Flow (Login, Callback, User-Check)
app.use('/auth', authRoutes); 

// --- 3. Status-Check-Route ---

app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'Mod-Panel API',
        timestamp: new Date().toISOString()
    });
});

// --- 4. Frontend-Fallback-Route (Wichtig für SPA Routing) ---

// Jede andere Anfrage, die keine der obigen Routen trifft (z.B. /dashboard/logs oder /dashboard), 
// wird auf die Haupt-index.html des Dashboards umgeleitet.
app.get('*', (req, res) => {
    // Stellt sicher, dass die index.html aus dem gebauten Frontend-Ordner ausgeliefert wird
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// --- 5. Server-Start-Logik ---

async function startServer() {
    if (!DISCORD_TOKEN) {
        console.error("❌ DISCORD_TOKEN fehlt. Bot wird nicht gestartet.");
    } else {
        initBot(DISCORD_TOKEN);
    }
    
    app.listen(API_PORT, () => {
        console.log(`🌐 Express API Server läuft auf http://localhost:${API_PORT}`);
        console.log(`💡 Dashboard wird von ${frontendPath} ausgeliefert.`);
    });
}

startServer();