const Platform = require("../models/platform");

const getPlatforms = async (req, res) => {
  try {
    const platforms = await Platform.find().sort({ platformNumber: 1 });
    res.json(platforms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPlatforms };