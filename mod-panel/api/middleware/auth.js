const { getClient } = require('../../bot/client'); 
const fetch = require('node-fetch');

const GUILD_ID = process.env.GUILD_ID;
const MODERATOR_ROLES = process.env.MODERATOR_ROLES ? process.env.MODERATOR_ROLES.split(',') : [];

async function isModerator(req, res, next) {
    const accessToken = req.cookies.access_token;
    
    if (!accessToken) {
        return res.status(401).json({ error: 'Nicht autorisiert. Bitte anmelden.' });
    }
    
    try {
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const userData = await userResponse.json();
        const userId = userData.id;

        const client = getClient();
        const guild = client.guilds.cache.get(GUILD_ID);
        
        if (!guild) { return res.status(500).json({ error: 'Bot konnte Server nicht finden.' }); }
        
        const member = await guild.members.fetch(userId).catch(() => null);

        if (!member) { return res.status(403).json({ error: 'Mitglied nicht auf dem Server.' }); }
        
        const hasModRole = member.roles.cache.some(role => MODERATOR_ROLES.includes(role.id));

        if (!hasModRole) { return res.status(403).json({ error: 'Zugriff verweigert. Keine Moderatoren-Rolle.' }); }
        
        req.user = userData; 
        next(); 

    } catch (error) {
        console.error('Authentifizierungs-Fehler:', error);
        res.status(500).json({ error: 'Authentifizierungsfehler.' });
    }
}

module.exports = { isModerator };
