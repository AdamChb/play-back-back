const express = require("express");
const router = express.Router();

const gameControllers = require("../controllers/gameControllers");
const { authenticateToken } = require("../middleware/authMiddleware");

// Route pour récupérer les jeux via une recherche du nom
router.get("/search", gameControllers.searchGames);
router.get("/:id", gameControllers.gameInfo);
router.get("/all", gameControllers.getAllGames);
router.post("/add", authenticateToken, gameControllers.addGame);
router.put("/update/:id", authenticateToken, gameControllers.updateGame);
router.delete("/delete/:id", authenticateToken, gameControllers.deleteGame);
router.get("/user", authenticateToken, gameControllers.getUserGames);
router.put("/user/update", authenticateToken, gameControllers.updateUserGame);

module.exports = router;
