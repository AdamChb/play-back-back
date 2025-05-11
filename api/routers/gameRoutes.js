const express = require("express");
const router = express.Router();

const gameControllers = require("../controllers/gameControllers");
const { authenticateToken } = require("../middleware/authMiddleware");

// Route pour récupérer les jeux via une recherche du nom
router.get("/search", authenticateToken, gameControllers.searchGames);

module.exports = router;
