const Games = require("../models/gameModels");
const { validateAdmin, validateEmployee, validateUser } = require("../middleware/validationMiddleware");

const searchGames = async (req, res) => {
  const { name } = req.query;

  try {
    const games = await Games.searchGames(name);
    res.json(games);
  } catch (error) {
    console.error("Error searching games:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const gameInfo = async (req, res) => {
  const { id_game } = req.params;

  if (!id_game) {
    return res.status(400).json({ error: "ID_game query parameter is required" });
  }

  try {
    const gameInfo = await Games.gameInfo(id_game);
    if (!gameInfo) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.status(200).json(gameInfo);
  } catch (error) {
    console.error("Error fetching game info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllGames = async (req, res) => {
  try {
    const games = await Games.getAllGames();
    res.status(200).json(games);
  } catch (error) {
    console.error("Error fetching all games:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserGames = async (req, res) => {
  const userId = req.user.id;

  if (!validateUser(req.user)) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const userGames = await Games.getUserGames(userId);
    res.json(userGames);
  } catch (error) {
    console.error("Error fetching user games:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUserGame = async (req, res) => {
  const userId = req.user.id;
  const { id_game, status } = req.body;

  if (!validateUser(req.user)) {
    return res.status(403).json({ error: "Access denied" });
  }

  if (!id_game && id_game !== 0) {
    return res.status(400).json({ error: "Games array is required" });
  }

  console.log("Received request to update user game:", { userId, id_game, status });
  if (status !== "aimé" && status !== "à tester") {
    return res.status(400).json({ error: "Invalid status. Must be 'aimé' or 'à tester'" });
  }

  try {
    await Games.updateUserGame(userId, id_game, status);
    res.status(200).json({ message: "User games updated successfully" });
  } catch (error) {
    console.error("Error updating user games:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  searchGames,
  gameInfo,
  getAllGames,
  getUserGames,
  updateUserGame
};
