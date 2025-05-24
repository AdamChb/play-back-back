const { pool } = require("../db");

// const searchGames = async (name) => {
//   try {
//     const [rows] = await pool.query(
//       "SELECT nom FROM games WHERE nom LIKE %?%",
//       ["%" + name + "%"]
//     );
//     return rows;
//   } catch (error) {
//     console.error("Error searching games:", error);
//     throw error;
//   }
// };

const searchGames = async (name) => {
  try {
    const [rows] = await pool.query("SELECT * FROM games WHERE nom LIKE ?", [
      "%" + name + "%",
    ]);
    return rows;
  } catch (error) {
    console.error("Error searching games:", error);
    throw error;
  }
};

const gameInfo = async (id_game) => {
  try {
    const [rows] = await pool.query("SELECT * FROM games WHERE id_game = ?", [
      id_game,
    ]);
    return rows;
  } catch (error) {
    console.error("Error fetching game info:", error);
    throw error;
  }
};

const getAllGames = async () => {
  try {
    const [rows] = await pool.query("SELECT * FROM games");
    return rows;
  } catch (error) {
    console.error("Error fetching all games:", error);
    throw error;
  }
};

const addGame = async (nom, description, image, date_sortie) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO games (nom, description, image, date_sortie) VALUES (?, ?, ?, ?)",
      [nom, description, image, date_sortie]
    );
    return { id_game: result.insertId, nom, description, image, date_sortie };
  } catch (error) {
    console.error("Error adding game:", error);
    throw error;
  }
};

const updateGame = async (id_game, nom, description, image, date_sortie) => {
  try {
    await pool.query(
      "UPDATE games SET nom = ?, description = ?, image = ?, date_sortie = ? WHERE id_game = ?",
      [nom, description, image, date_sortie, id_game]
    );
    return { id_game, nom, description, image, date_sortie };
  } catch (error) {
    console.error("Error updating game:", error);
    throw error;
  }
};

const deleteGame = async (id_game) => {
  try {
    await pool.query("DELETE FROM games WHERE id_game = ?", [id_game]);
    return { message: "Game deleted successfully" };
  } catch (error) {
    console.error("Error deleting game:", error);
    throw error;
  }
};

const getUserGames = async (userId) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM user_games WHERE user_id = ?",
      [userId]
    );
    return rows;
  } catch (error) {
    console.error("Error fetching user games:", error);
    throw error;
  }
};

const updateUserGame = async (userId, gameId, status) => {
  try {
    await pool.query(
      "UPDATE user_games SET status = ? WHERE user_id = ? AND game_id = ?",
      [status, userId, gameId]
    );
    return { userId, gameId, status };
  } catch (error) {
    console.error("Error updating user game:", error);
    throw error;
  }
};

module.exports = {
  searchGames
};
