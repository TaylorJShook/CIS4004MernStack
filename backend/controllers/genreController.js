const Genre = require("../models/genre");

const getGenres = async (req, res) => {
  try {
    const genres = await Genre.find().sort({ genreNumber: 1 });
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getGenres };