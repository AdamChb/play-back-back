const { pool } = require('../db');

const createEvent = async (title, description, date, location) => {
    const query = 'INSERT INTO Evenement (Titre, Description, Date_evenement, Lieu) VALUES (?, ?, ?, ?)';
    const values = [title, description, date, location];

    try {
        const [result] = await pool.execute(query, values);
        return { id: result.insertId, title, description, date, location };
    } catch (error) {
        console.error('Error creating event:', error);
        throw error;
    }
};

const findEventById = async (id) => {
    const query = 'SELECT * FROM Evenement WHERE ID_evenement = ?';
    const values = [id];

    try {
        const [rows] = await pool.execute(query, values);
        return rows[0]; // Return the first row if found
    } catch (error) {
        console.error('Error finding event by ID:', error);
        throw error;
    }
};

const deleteEvent = async (id) => {
    const query = 'DELETE FROM Evenement WHERE ID_evenement = ?';
    const values = [id];

    try {
        const [result] = await pool.execute(query, values);
        return result.affectedRows; // Return the number of affected rows
    } catch (error) {
        console.error('Error deleting event:', error);
        throw error;
    }
};

const updateEvent = async (id, title, description, date, location) => {
    const query = `UPDATE Evenement SET Titre = ?, Description = ?, Date_evenement = ?, Lieu = ? WHERE ID_evenement = ?`;
    const values = [title, description, date, location, id];

    try {
        const [result] = await pool.execute(query, values);
        return result.affectedRows; // Return the number of affected rows
    } catch (error) {
        console.error('Error updating event:', error);
        throw error;
    }
};

const toggleAttendance = async (eventId, userId) => {
    const query = 'CALL toggle_event_attendance(?, ?)';
    const values = [eventId, userId];

    try {
        const [result] = await pool.execute(query, values);
        return result; // Return the result of the stored procedure
    } catch (error) {
        console.error('Error toggling attendance:', error);
        throw error;
    }
};

const searchEvents = async (searchTerm) => {
    const query = 'SELECT * FROM Evenement WHERE Titre LIKE ? OR Description LIKE ?';
    const values = [`%${searchTerm}%`, `%${searchTerm}%`];

    try {
        const [rows] = await pool.execute(query, values);
        return rows; // Return all matching events
    } catch (error) {
        console.error('Error searching events:', error);
        throw error;
    }
};

const getNextEvents = async () => {
    const query = 'SELECT * FROM Evenement WHERE Date_evenement >= NOW() ORDER BY Date_evenement ASC LIMIT 10';

    try {
        const [rows] = await pool.execute(query);
        return rows; // Return the next events
    } catch (error) {
        console.error('Error getting next events:', error);
        throw error;
    }
};

const getAllEvents = async () => {
    const query = 'SELECT * FROM Evenement ORDER BY Date_evenement DESC';

    try {
        const [rows] = await pool.execute(query);
        return rows; // Return all events
    } catch (error) {
        console.error('Error getting all events:', error);
        throw error;
    }
};

const enrollEvent = async (eventId, userId) => {
    const query = 'CALL enroll_event(?, ?)';
    const values = [eventId, userId];

    try {
        const [result] = await pool.execute(query, values);
        return result; // Return the result of the stored procedure
    } catch (error) {
        console.error('Error enrolling in event:', error);
        throw error;
    }
};

const getUserNextEvents = async (userId) => {
    const query = 'SELECT * FROM Evenement WHERE ID_evenement IN (SELECT ID_evenement FROM Participation WHERE ID_utilisateur = ?) AND Date_evenement >= NOW() ORDER BY Date_evenement ASC';
    const values = [userId];

    try {
        const [rows] = await pool.execute(query, values);
        return rows; // Return the user's next events
    } catch (error) {
        console.error('Error getting user next events:', error);
        throw error;
    }
};

const getUserOldEvents = async (userId) => {
    const query = 'SELECT * FROM Evenement WHERE ID_evenement IN (SELECT ID_evenement FROM Participation WHERE ID_utilisateur = ?) AND Date_evenement < NOW() ORDER BY Date_evenement DESC';
    const values = [userId];

    try {
        const [rows] = await pool.execute(query, values);
        return rows; // Return the user's old events
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
    searchEvents,
    getNextEvents,
    getAllEvents,
    enrollEvent,
    getUserNextEvents,
    getUserOldEvents
};
