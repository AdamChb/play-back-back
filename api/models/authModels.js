const { pool } = require('../db');

const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM Utilisateur WHERE email = ?';
    const values = [email];

    try {
        const [rows] = await pool.execute(query, values);
        return rows[0]; // Return the first row if found
    } catch (error) {
        console.error('Error finding user by email:', error);
        throw error;
    }
};

const findUserById = async (id) => {
    const query = 'SELECT * FROM Utilisateur WHERE ID_utilisateur = ?';
    const values = [id];

    try {
        const [rows] = await pool.execute(query, values);
        return rows[0]; // Return the first row if found
    } catch (error) {
        console.error('Error finding user by ID:', error);
        throw error;
    }
};

const createUser = async (pseudo, email, password, role) => {
    const query = 'CALL ajouter_utilisateur(?, ?, ?, ?)';
    const values = [pseudo, email, password, role];

    try {
        const [result] = await pool.execute(query, values);
        const insertedId = result.insertId;
        return { ID_personne: insertedId, Pseudo: pseudo, Email: email };
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

const updateUser = async (id, pseudo, email, mot_de_passe, role_user) => {
    const query = `UPDATE Utilisateur SET ${Object.entries({ pseudo, email, mot_de_passe, role_user }).filter(([_, v]) => v !== undefined).map(([k]) => `${k} = ?`).join(', ')} WHERE ID_utilisateur = ?`;
    const values = [pseudo, email, mot_de_passe, role_user, id];
    const filteredValues = values.filter(value => value !== undefined);

    try {
        const [result] = await pool.execute(query, filteredValues);
        return result.affectedRows; // Return the number of affected rows
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

const deleteUser = async (id) => {
    const query = 'DELETE FROM Utilisateur WHERE ID_utilisateur = ?';
    const values = [id];

    try {
        const [result] = await pool.execute(query, values);
        return result.affectedRows; // Return the number of affected rows
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

const findAllUsers = async () => {
    const query = 'SELECT * FROM Utilisateur';
    const values = [];

    try {
        const [rows] = await pool.execute(query, values);
        return rows; // Return all users
    } catch (error) {
        console.error('Error finding all users:', error);
        throw error;
    }
};

module.exports = {
    findUserByEmail,
    findUserById,
    createUser,
    updateUser,
    deleteUser,
    findAllUsers
};
