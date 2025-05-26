const { pool } = require('../db');

// Créer un événement (pas de procédure, insertion directe)
const createEvent = async (nom_session, description, date_heure, difficulte, nb_part_max, duree, ID_jeux) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Création de l'événement
        const insertEventQuery = `
            INSERT INTO evenement (nom_session, description, date_heure, difficulte, nb_part_max, duree)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const eventValues = [nom_session, description, date_heure, difficulte, nb_part_max, duree];
        const [result] = await conn.execute(insertEventQuery, eventValues);
        const eventId = result.insertId;

        // Association des jeux à l'événement
        if (Array.isArray(ID_jeux) && ID_jeux.length > 0) {
            const insertGamesQuery = `
                INSERT INTO evenement_jeux (ID_jeu, ID_evenement)
                VALUES ${ID_jeux.map(() => '(?, ?)').join(', ')}
            `;
            const gamesValues = ID_jeux.flatMap(id_jeu => [id_jeu, eventId]);
            await conn.execute(insertGamesQuery, gamesValues);
        }

        await conn.commit();
        return { id: eventId, nom_session, description, date_heure, difficulte, nb_part_max, duree, jeux: ID_jeux };
    } catch (error) {
        await conn.rollback();
        console.error('Error creating event:', error);
        throw error;
    } finally {
        conn.release();
    }
};

// Trouver un événement par ID
const findEventById = async (id) => {
    const query = 'SELECT * FROM evenement WHERE ID_evenement = ?';
    try {
        const [rows] = await pool.execute(query, [id]);
        return rows[0];
    } catch (error) {
        console.error('Error finding event by ID:', error);
        throw error;
    }
};

// Supprimer un événement
const deleteEvent = async (id) => {
    const queries = [
        'DELETE FROM utilisateur_evenements WHERE ID_evenement = ?',
        'DELETE FROM evenement_jeux WHERE ID_evenement = ?',
        'DELETE FROM evenement WHERE ID_evenement = ?'
    ];
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        for (const query of queries) {
            await conn.execute(query, [id]);
        }
        await conn.commit();
        return true;
    } catch (error) {
        await conn.rollback();
        console.error('Error deleting event:', error);
        throw error;
    } finally {
        conn.release();
    }
};

// Mettre à jour un événement
const updateEvent = async (id, nom_session, description, date_heure, difficulte, nb_part_max, duree) => {
    // Construction dynamique de la requête comme dans updateUser
    const fields = { nom_session, description, date_heure, difficulte, nb_part_max, duree };
    const setClause = Object.entries(fields)
        .filter(([_, v]) => v !== undefined)
        .map(([k]) => `${k} = ?`)
        .join(', ');
    const values = Object.values(fields).filter(v => v !== undefined);

    const query = `UPDATE evenement SET ${setClause} WHERE ID_evenement = ?`;
    values.push(id);

    try {
        const [result] = await pool.execute(query, values);
        return result.affectedRows;
    } catch (error) {
        console.error('Error updating event:', error);
        throw error;
    }
};

// Toggle la participation à un événement (utilise les procédures stockées corrigées)
const toggleAttendance = async (eventId, userId) => {
    const checkQuery = `SELECT * FROM utilisateur_evenements WHERE ID_utilisateur = ? AND ID_evenement = ?`;
    const [rows] = await pool.execute(checkQuery, [userId, eventId]);
    if (rows.length > 0) {
        // Déjà inscrit, on retire
        await pool.query('CALL delete_user_participation(?, ?)', [userId, eventId]);
        return { enrolled: false };
    } else {
        // Pas encore inscrit, on ajoute
        await pool.query('CALL add_user_participation(?, ?)', [userId, eventId]);
        return { enrolled: true };
    }
};

const checkAttendance = async (eventId, userId) => {
    const query = `
        UPDATE utilisateur_evenements SET venu = 1 WHERE utilisateur_evenements.ID_utilisateur = ? AND utilisateur_evenements.ID_evenement = ?
    `;
    try {
        const [rows] = await pool.execute(query, [userId, eventId]);
        return rows.length > 0;
    } catch (error) {
        console.error('Error checking attendance:', error);
        throw error;
    }
};

// Recherche d'événements (titre ou description)
const searchEvents = async (searchTerm) => {
    const query = `
        SELECT * FROM evenement
        WHERE nom_session LIKE ? OR description LIKE ?
    `;
    const values = [`%${searchTerm}%`, `%${searchTerm}%`];
    try {
        const [rows] = await pool.execute(query, values);
        return rows;
    } catch (error) {
        console.error('Error searching events:', error);
        throw error;
    }
};

// Prochains événements (utilise la vue)
const getNextEvents = async () => {
    const query = 'SELECT * FROM vue_evenements_futurs ORDER BY date_heure ASC LIMIT 10';
    try {
        const [rows] = await pool.execute(query);
        return rows;
    } catch (error) {
        console.error('Error getting next events:', error);
        throw error;
    }
};

// Tous les événements
const getAllEvents = async () => {
    const query = 'SELECT * FROM evenement ORDER BY date_heure DESC';
    try {
        const [rows] = await pool.execute(query);
        return rows;
    } catch (error) {
        console.error('Error getting all events:', error);
        throw error;
    }
};

// Inscription à un événement (utilise la procédure corrigée)
const enrollEvent = async (eventId, userId) => {
    await pool.query('CALL add_user_participation(?, ?)', [userId, eventId]);
    return { enrolled: true };
};

// Prochains événements de l'utilisateur
const getUserNextEvents = async (userId) => {
    const query = `
        SELECT e.*
        FROM evenement e
        JOIN utilisateur_evenements ue ON e.ID_evenement = ue.ID_evenement
        WHERE ue.ID_utilisateur = ? AND e.date_heure >= NOW()
        ORDER BY e.date_heure ASC
    `;
    try {
        const [rows] = await pool.execute(query, [userId]);
        return rows;
    } catch (error) {
        console.error('Error getting user next events:', error);
        throw error;
    }
};

// Événements passés de l'utilisateur
const getUserOldEvents = async (userId) => {
    const query = `
        SELECT e.*
        FROM evenement e
        JOIN utilisateur_evenements ue ON e.ID_evenement = ue.ID_evenement
        WHERE ue.ID_utilisateur = ? AND e.date_heure < NOW()
        ORDER BY e.date_heure DESC
    `;
    try {
        const [rows] = await pool.execute(query, [userId]);
        return rows;
    } catch (error) {
        console.error('Error getting user old events:', error);
        throw error;
    }
};

module.exports = {
    createEvent,
    findEventById,
    deleteEvent,
    updateEvent,
    toggleAttendance,
    checkAttendance,
    searchEvents,
    getNextEvents,
    getAllEvents,
    enrollEvent,
    getUserNextEvents,
    getUserOldEvents
};