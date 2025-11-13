const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers, // Erfordert Aktivierung im Developer Portal
    ]
});
let botClient = null;

module.exports = {
    init: (token) => {
        client.on('ready', () => {
            console.log(`🤖 Discord-Bot als ${client.user.tag} eingeloggt!`);
        });

        client.login(token)
            .catch(error => console.error("Fehler beim Einloggen des Bots:", error));
        
        botClient = client;
        return client;
    },
    getClient: () => botClient
};
