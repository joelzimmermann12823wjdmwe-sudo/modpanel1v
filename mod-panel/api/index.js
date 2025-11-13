// api/index.js
require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path'); 

const { init: initBot } = require('../bot/client');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const API_PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cookieParser()); 

// --- 1. Statische Dateien des Frontends ausliefern ---

// Der Pfad zum gebauten Frontend-Verzeichnis (mod-panel/dashboard/dist)
const frontendPath = path.join(__dirname, '..', 'dashboard', 'dist');

// Express Static Middleware, um JS/CSS/Bilder auszuliefern
app.use(express.static(frontendPath));

// --- 2. API- und Auth-Routen einbinden ---

const moderationRoutes = require('./routes/moderation');
const authRoutes = require('./routes/auth');

app.use('/api/mod', moderationRoutes); 
app.use('/auth', authRoutes); 

app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'Mod-Panel API',
        timestamp: new Date().toISOString()
    });
});

// --- 3. Frontend-Fallback-Route (Wichtig für SPA Routing) ---

// Leitet alle nicht gefundenen Routen auf die index.html des Dashboards um.
app.get('*', (req, res) => {
    // Prüft zuerst, ob die index.html existiert, um den ENOENT-Fehler zu vermeiden
    const indexPath = path.join(frontendPath, 'index.html');
    
    if (require('fs').existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(500).send("<h1>Fehler: Frontend nicht gefunden</h1><p>Bitte stellen Sie sicher, dass der 'npm run build' Befehl im 'dashboard' Ordner erfolgreich ausgeführt wurde.</p>");
    }
});

// --- 4. Server-Start-Logik ---

async function startServer() {
    if (!DISCORD_TOKEN) {
        console.error("❌ DISCORD_TOKEN fehlt. Bot wird nicht gestartet.");
    } else {
        initBot(DISCORD_TOKEN);
    }
    
    app.listen(API_PORT, () => {
        console.log(`🌐 Express API Server läuft auf http://localhost:${API_PORT}`);
    });
}

startServer();
