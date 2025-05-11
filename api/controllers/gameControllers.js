const Games = require("../models/gamesModels");

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

module.exports = {
  searchGames,
};
