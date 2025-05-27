const { pool } = require("../db");

// Recherche de jeux par nom
const searchGames = async (name) => {
  try {
    const [rows] = await pool.query("SELECT * FROM jeu WHERE nom LIKE ?", [
      `%${name}%`,
    ]);
    return rows;
  } catch (error) {
    console.error("Error searching games:", error);
    throw error;
  }
};

// Infos d'un jeu par ID
const gameInfo = async (id_jeu) => {
  try {
    const [rows] = await pool.query("SELECT * FROM jeu WHERE ID_jeu = ?", [
      id_jeu,
    ]);
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

const getUserGameById = async (userId, gameId) => {
  try {
    const [rows] = await pool.query(
      `SELECT uj.statut
       FROM utilisateurs_jeux uj
       WHERE uj.ID_utilisateur = ? AND uj.ID_jeu = ?`,
      [userId, gameId]
    );
    return rows || null;
  } catch (error) {
    console.error("Error fetching user game by ID:", error);
    throw error;
  }
};

// Mise à jour du statut d'un jeu pour un utilisateur via la procédure stockée
const updateUserGame = async (userId, gameId, statut) => {
  try {
    await pool.query("CALL update_status(?, ?, ?)", [userId, gameId, statut]);
    return { userId, gameId, statut };
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
  getUserGameById,
  updateUserGame,
};
