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

module.exports = {
  searchGames
};
