const Rating = require("../models/rating");
const Game = require("../models/game");

const rateGame = async (req, res) => {
  try {
    const { gameNumber, vote } = req.body;

    if (!gameNumber || !vote) {
      return res.status(400).json({ message: "gameNumber and vote are required" });
    }

    if (!["up", "down"].includes(vote)) {
      return res.status(400).json({ message: "Vote must be 'up' or 'down'" });
    }

    const game = await Game.findOne({ gameNumber });
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    let rating = await Rating.findOne({ user: req.user._id, game: game._id });

    if (!rating) {
      const lastRating = await Rating.findOne().sort({ ratingNumber: -1 });
      const nextRatingNumber = lastRating ? lastRating.ratingNumber + 1 : 1;

      rating = await Rating.create({
        ratingNumber: nextRatingNumber,
        user: req.user._id,
        game: game._id,
        vote,
      });

      game.totalRatings += 1;
      if (vote === "up") {
        game.positiveRatings += 1;
      }

      await game.save();

      return res.status(201).json({ message: "Rating created", rating, game });
    }

    const oldVote = rating.vote;

    if (oldVote !== vote) {
      if (oldVote === "up") game.positiveRatings -= 1;
      if (vote === "up") game.positiveRatings += 1;

      rating.vote = vote;
      await rating.save();
      await game.save();
    }

    res.json({ message: "Rating updated", rating, game });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate rating" });
    }
    res.status(500).json({ message: error.message });
  }
};

const unrateGame = async (req, res) => {
  try {
    const game = await Game.findOne({ gameNumber: req.params.gameNumber });

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    const rating = await Rating.findOne({ user: req.user._id, game: game._id });

    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    game.totalRatings -= 1;
    if (rating.vote === "up") {
      game.positiveRatings -= 1;
    }

    await rating.deleteOne();
    await game.save();

    res.json({ message: "Rating removed", game });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ user: req.user._id })
      .populate({
        path: "game",
        select: "gameNumber title coverImageUrl totalRatings positiveRatings positivePercentage",
      })
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { rateGame, unrateGame, getMyRatings };