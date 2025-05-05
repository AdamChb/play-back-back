const mysql = require('mysql2/promise'); // Utiliser la version promise de mysql2
require('dotenv').config();

let pool;

// Initialiser le pool de connexions
function initPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10, // Limite de connexions simultanées
      queueLimit: 0,
    });
    console.log('Database pool initialized');
  }
  return pool;
}

// Méthode pour fermer le pool proprement
async function closePool() {
  if (pool) {
    try {
      await pool.end();
      console.log('Database pool closed');
    } catch (err) {
      console.error('Error closing the database pool:', err);
    }
    pool = null; // Réinitialiser le pool après fermeture
  }
}

// Méthode pour gérer les erreurs et redémarrer le pool si nécessaire
async function handleDatabaseError(err) {
  console.error('Database error:', err);

  // Si l'erreur est critique, redémarrer le pool
  if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.fatal) {
    console.log('Reinitializing database pool...');
    await closePool(); // Fermer le pool existant
    initPool(); // Réinitialiser le pool
  }
}

pool = initPool(); // Initialiser le pool au démarrage du module

module.exports = { pool, initPool, closePool, handleDatabaseError };