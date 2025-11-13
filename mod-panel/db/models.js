const db = require('./index');

async function createAction(targetUserId, moderatorId, actionType, reason, durationMs = null) {
    const queryText = `
        INSERT INTO moderation_actions(
            target_user_id, 
            moderator_id, 
            action_type, 
            reason, 
            duration_ms, 
            is_active, 
            timestamp
        ) 
        VALUES(, , , , , , NOW()) 
        RETURNING *;
    `;
    const isActive = (actionType === 'BAN' || actionType === 'TIMEOUT');
    
    const values = [targetUserId, moderatorId, actionType, reason, durationMs, isActive];
    
    try {
        const res = await db.query(queryText, values);
        return res.rows[0];
    } catch (err) {
        console.error('Datenbankfehler beim Speichern der Aktion:', err.message);
        throw new Error('Speichern der Moderations-Aktion fehlgeschlagen.');
    }
}

async function getActions(targetUserId = null) {
    let queryText = 'SELECT * FROM moderation_actions ORDER BY timestamp DESC';
    let values = [];
    
    if (targetUserId) {
        queryText = 'SELECT * FROM moderation_actions WHERE target_user_id = $1 ORDER BY timestamp DESC';
        values = [targetUserId];
    }
    
    try {
        const res = await db.query(queryText, values);
        return res.rows;
    } catch (err) {
        console.error('Datenbankfehler beim Abrufen der Logs:', err.message);
        return [];
    }
}

module.exports = {
    createAction,
    getActions
};
