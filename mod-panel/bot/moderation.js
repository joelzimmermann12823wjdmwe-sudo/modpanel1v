const { getClient } = require('./client');

const GUILD_ID = process.env.GUILD_ID;

async function banMember(userId, reason) {
    const client = getClient();
    if (!client) {
        throw new Error("Discord Client ist nicht initialisiert.");
    }

    try {
        const guild = client.guilds.cache.get(GUILD_ID);

        if (!guild) {
            throw new Error(`Server mit ID ${GUILD_ID} nicht gefunden.`);
        }

        await guild.members.ban(userId, { reason: reason || 'Kein Grund angegeben (via Mod Panel)' });
        
        console.log(`[BOT] Benutzer ${userId} erfolgreich gebannt.`);
        return { success: true, message: "Benutzer gebannt." };

    } catch (error) {
        console.error(`[BOT Fehler] Fehler beim Bannen von ${userId}:`, error.message);
        return { success: false, message: `Aktion fehlgeschlagen: ${error.message}` };
    }
}

module.exports = {
    banMember,
};
