const Game = require("../models/game");

const getGames = async (req, res) => {
    const games = await Game.find();
    res.json(games);
};

module.exports = { getGames };
