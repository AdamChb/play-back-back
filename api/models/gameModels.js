const { pool } = require("../db");

// Recherche de jeux par nom
const searchGames = async (name) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM jeu WHERE nom LIKE ?",
      [`%${name}%`]
    );
    return rows;
  } catch (error) {
    console.error("Error searching games:", error);
    throw error;
  }
};

// Infos d'un jeu par ID
const gameInfo = async (id_jeu) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM jeu WHERE ID_jeu = ?",
      [id_jeu]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error fetching game info:", error);
    throw error;
  }
};

// Tous les jeux
const getAllGames = async () => {
  try {
    const [rows] = await pool.query("SELECT * FROM jeu");
    return rows;
  } catch (error) {
    console.error("Error fetching all games:", error);
    throw error;
  }
};

// Jeux d'un utilisateur
const getUserGames = async (userId) => {
  try {
    const [rows] = await pool.query(
      `SELECT j.* , uj.date_, uj.statut
       FROM utilisateurs_jeux uj
       JOIN jeu j ON uj.ID_jeu = j.ID_jeu
       WHERE uj.ID_utilisateur = ?`,
      [userId]
    );
    return rows;
  } catch (error) {
    console.error("Error fetching user games:", error);
    throw error;
  }
};

// Mise à jour du statut d'un jeu pour un utilisateur via la procédure stockée
const updateUserGame = async (userId, gameId, statut, type) => {
  try {
    if (type === 1) {
      await pool.query(
        "CALL update_status(?, ?, ?)",
        [userId, gameId, statut]
      );
      return { userId, gameId, statut };
    } else if (type === 0) {
      await pool.query(
        "DELETE FROM utilisateurs_jeux WHERE ID_utilisateur = ? AND ID_jeu = ? AND statut = ?",
        [userId, gameId, statut]
      );
      return { userId, gameId, deleted: true };
    }
    
  } catch (error) {
    console.error("Error updating user game:", error);
    throw error;
  }
};


module.exports = {
  searchGames,
  gameInfo,
  getAllGames,
  getUserGames,
  updateUserGame
};