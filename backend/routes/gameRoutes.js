const express = require("express");
const router = express.Router();
const { getGames, getGame, createGame, updateGame, deleteGame } = require("../controllers/gameController");

router.get("/api/games", getGames);
router.get("/api/games/:gameId", getGame);
router.post("/api/games", createGame);
router.put("/api/games/:gameId", updateGame);
router.delete("/api/games/:gameId", deleteGame);

module.exports = router;
