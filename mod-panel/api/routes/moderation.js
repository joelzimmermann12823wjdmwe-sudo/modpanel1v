const express = require('express');
const router = express.Router();
const { banMember } = require('../../bot/moderation'); 
const { isModerator } = require('../middleware/auth');
const { createAction, getActions } = require('../../db/models'); 

router.post('/ban', isModerator, async (req, res) => {
    const { userId, reason } = req.body;
    const moderatorId = req.user.id; 

    if (!userId) {
        return res.status(400).json({ error: 'User ID ist erforderlich.' });
    }

    try {
        const logEntry = await createAction(userId, moderatorId, 'BAN', reason);

        const result = await banMember(userId, reason);
        
        if (result.success) {
            res.status(200).json({ message: 'Ban-Aktion erfolgreich an Discord gesendet und geloggt.', log: logEntry });
        } else {
            res.status(500).json({ error: 'Fehler beim Ausführen der Discord-Aktion.', details: result.message });
        }
        
    } catch (error) {
        res.status(500).json({ error: 'Interner Serverfehler beim Bannen.' });
    }
});

router.get('/logs', isModerator, async (req, res) => {
    try {
        const logs = await getActions();
        res.status(200).json({ logs: logs });
    } catch (error) {
        console.error('Fehler beim Abrufen der Logs:', error);
        res.status(500).json({ error: 'Logs konnten nicht abgerufen werden.' });
    }
});

module.exports = router;
