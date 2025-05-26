const express = require("express");
const router = express.Router();

const gameControllers = require("../controllers/gameControllers");
const { authenticateToken } = require("../middleware/authMiddleware");

// Route pour récupérer les jeux via une recherche du nom
router.get("/search", gameControllers.searchGames);
router.get("/all", gameControllers.getAllGames);
router.get("/user", authenticateToken, gameControllers.getUserGames);
router.put("/user/update", authenticateToken, gameControllers.updateUserGame);
router.get("/:id_game", gameControllers.gameInfo);

module.exports = router;
