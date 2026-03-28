const express = require("express");
const router = express.Router();
const { getGames } = require("../controllers/gameController");

router.get("/api/games", getGames);

module.exports = router;
