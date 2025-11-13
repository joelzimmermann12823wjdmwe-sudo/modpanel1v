const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { isModerator } = require('../middleware/auth');

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const SCOPES = 'identify%20guilds'; 

router.get('/login', (req, res) => {
    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPES}`;
    res.redirect(discordAuthUrl);
});

router.get('/callback', async (req, res) => {
    const code = req.query.code;

    if (!code) { return res.status(400).send('Fehler: Code fehlt.'); }

    try {
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI,
                scope: 'identify guilds'
            })
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;
        
        if (!accessToken) {
             return res.status(400).send('Fehler beim Abrufen des Tokens: ' + (tokenData.error_description || 'Unbekannt.'));
        }

        res.cookie('access_token', accessToken, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 7 * 24 * 60 * 60 * 1000 
        }); 
        
        res.redirect('/dashboard'); 

    } catch (error) {
        console.error('OAuth2 Callback Fehler:', error);
        res.status(500).send('Authentifizierungsfehler.');
    }
});

router.get('/user', isModerator, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;
