const Games = require("../models/gameModels");
const { validateAdmin, validateEmployee, validateUser } = require("../middleware/validationMiddleware");

const searchGames = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: "Name query parameter is required" });
  }

  try {
    const games = await Games.searchGames(name);
    res.json(games);
  } catch (error) {
    console.error("Error searching games:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const gameInfo = async (req, res) => {
  const { id_game } = req.query;

  if (!id_game) {
    return res.status(400).json({ error: "ID_game query parameter is required" });
  }

  try {
    const gameInfo = await Games.gameInfo(id_game);
    if (gameInfo.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.status(200).json(gameInfo[0]);
  } catch (error) {
    console.error("Error fetching game info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllGames = async (req, res) => {
  try {
    const games = await Games.getAllGames();
    res.json(games);
  } catch (error) {
    console.error("Error fetching all games:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addGame = async (req, res) => {
  const { nom, description, image, date_sortie } = req.body;

  if (validateAdmin(req.user) && validateEmployee(req.user)) {
    return res.status(403).json({ error: "Access denied" });
  }

  if (!nom || !description || !image || !date_sortie) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newGame = await Games.addGame(nom, description, image, date_sortie);
    res.status(201).json(newGame);
  } catch (error) {
    console.error("Error adding game:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  searchGames,
};
