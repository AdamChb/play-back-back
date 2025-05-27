const { pool } = require("../db");

const findUserByString = async (string) => {
  const query = "SELECT * FROM Utilisateur WHERE pseudo LIKE ? OR email LIKE ?";
  const values = [`%${string}%`, `%${string}%`];

  try {
    const [rows] = await pool.execute(query, values);
    return rows; // Return the first row if found
  } catch (error) {
    console.error("Error finding user by string:", error);
    throw error;
  }
};

const findUserByEmail = async (email) => {
  const query = "SELECT * FROM Utilisateur WHERE email = ?";
  const values = [email];

  try {
    const [rows] = await pool.execute(query, values);
    return rows[0]; // Return the first row if found
  } catch (error) {
    console.error("Error finding user by string:", error);
    throw error;
  }
};

const findUserById = async (id) => {
  const query = "SELECT * FROM Utilisateur WHERE ID_utilisateur = ?";
  const values = [id];

  try {
    const [rows] = await pool.execute(query, values);
    return rows[0]; // Return the first row if found
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw error;
  }
};

const createUser = async (pseudo, email, password, role) => {
  const query = "CALL ajouter_utilisateur(?, ?, ?, ?)";
  const values = [pseudo, email, password, role];

  try {
    const [result] = await pool.execute(query, values);
    const insertedId = result.insertId;
    return { ID_utilisateur: insertedId, pseudo: pseudo, email: email };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

const updateUser = async (id, pseudo, email, mot_de_passe, role_user) => {
  const query = `UPDATE Utilisateur SET ${Object.entries({
    pseudo,
    email,
    mot_de_passe,
    role_user,
  })
    .filter(([_, v]) => v !== undefined)
    .map(([k]) => `${k} = ?`)
    .join(", ")} WHERE ID_utilisateur = ?`;
  const values = [pseudo, email, mot_de_passe, role_user, id];
  const filteredValues = values.filter((value) => value !== undefined);

  try {
    const [result] = await pool.execute(query, filteredValues);
    return result.affectedRows; // Return the number of affected rows
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

const deleteUser = async (id) => {
  const queries = [
    `DELETE FROM utilisateur_evenements WHERE ID_utilisateur = ?`,
    `DELETE FROM utilisateurs_jeux WHERE ID_utilisateur = ?`,
    `DELETE FROM Utilisateur WHERE ID_utilisateur = ?`,
  ];
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    for (const query of queries) {
      await connection.execute(query, [id]);
    }
    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting user:", error);
    throw error;
  } finally {
    connection.release();
  }
};

const findAllUsers = async () => {
  const query = "SELECT * FROM Utilisateur";
  const values = [];

  try {
    const [rows] = await pool.execute(query, values);
    return rows; // Return all users
  } catch (error) {
    console.error("Error finding all users:", error);
    throw error;
  }
};

module.exports = {
  findUserByEmail,
  findUserByString,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
  findAllUsers,
};
