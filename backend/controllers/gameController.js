const Game = require("../models/game");

const getGames = async (req, res) => {
    const games = await Game.find();
    res.json(games);
};

const getGame = async (req, res) => {
    const game = await Game.findOne({ gameNumber: req.params.gameId })
    if (!game) { res.status(404).json({ message: `Game with GameNumber ${req.params.gameId} Not Found` }) }
    res.status(200).json(game)
};

const createGame = async (req, res) => {
    const lastGame = await Game.findOne().sort({ gameNumber: -1 });
    const nextGameNumber = lastGame ? lastGame.gameNumber + 1 : 1;

    const game = new Game({ gameNumber: nextGameNumber, ...req.body });
    const savedGame = await game.save();
    res.status(201).json(savedGame);
};

const updateGame = async (req, res) => {
    const updatedGame = await Game.findOneAndUpdate(
        { gameNumber: req.params.gameId },
        req.body,
        { new: true, runValidators: true }
    );
    if (!updatedGame) return res.status(404).json({ message: "Game not found" });
    res.json(updatedGame);
};

const deleteGame = async (req, res) => {
    const deletedGame = await Game.findOneAndDelete({ gameNumber: req.params.gameId });
    if (!deletedGame) return res.status(404).json({ message: "Game not found" });
    res.json({ message: "Game deleted", game: deletedGame });
};

module.exports = { getGames, getGame, createGame, updateGame, deleteGame };
