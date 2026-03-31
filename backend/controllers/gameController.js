const Game = require("../models/game");
const Rating = require("../models/rating");

const getGames = async (req, res) => {
  try {
    const games = await Game.find()
      .populate("createdBy", "username role")
      .populate("genres", "name genreNumber")
      .populate("platforms", "name platformNumber")
      .sort({ createdAt: -1 });

    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGame = async (req, res) => {
  try {
    const game = await Game.findOne({ gameNumber: req.params.gameId })
      .populate("createdBy", "username role")
      .populate("genres", "name genreNumber")
      .populate("platforms", "name platformNumber");

    if (!game) {
      return res.status(404).json({
        message: `Game with GameNumber ${req.params.gameId} not found`,
      });
    }

    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createGame = async (req, res) => {
  try {
    const lastGame = await Game.findOne().sort({ gameNumber: -1 });
    const nextGameNumber = lastGame ? lastGame.gameNumber + 1 : 1;

    const { title, description, coverImageUrl, genres, platforms } = req.body;

    if (!title || !description || !coverImageUrl) {
      return res.status(400).json({ message: "Missing required game fields" });
    }

    const existingGame = await Game.findOne({ title });
    if (existingGame) {
      return res.status(400).json({ message: "A game with that title already exists" });
    }

    const game = new Game({
      gameNumber: nextGameNumber,
      title,
      description,
      coverImageUrl,
      createdBy: req.user._id,
      genres: genres || [],
      platforms: platforms || [],
      totalRatings: 0,
      positiveRatings: 0,
    });

    const savedGame = await game.save();

    const populatedGame = await Game.findById(savedGame._id)
      .populate("createdBy", "username role")
      .populate("genres", "name genreNumber")
      .populate("platforms", "name platformNumber");

    res.status(201).json(populatedGame);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate gameNumber or title" });
    }
    res.status(500).json({ message: error.message });
  }
};

const updateGame = async (req, res) => {
  try {
    const { title, description, coverImageUrl, genres, platforms } = req.body;

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (coverImageUrl !== undefined) updateFields.coverImageUrl = coverImageUrl;
    if (genres !== undefined) updateFields.genres = genres;
    if (platforms !== undefined) updateFields.platforms = platforms;

    const updatedGame = await Game.findOneAndUpdate(
      { gameNumber: req.params.gameId },
      updateFields,
      { new: true, runValidators: true }
    )
      .populate("createdBy", "username role")
      .populate("genres", "name genreNumber")
      .populate("platforms", "name platformNumber");

    if (!updatedGame) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.json(updatedGame);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteGame = async (req, res) => {
  try {
    const deletedGame = await Game.findOneAndDelete({ gameNumber: req.params.gameId });

    if (!deletedGame) {
      return res.status(404).json({ message: "Game not found" });
    }

    await Rating.deleteMany({ game: deletedGame._id });

    res.json({ message: "Game deleted", game: deletedGame });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getGames, getGame, createGame, updateGame, deleteGame };