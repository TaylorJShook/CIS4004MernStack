const express = require("express");
const router = express.Router();
const { getGames, getGame, createGame, updateGame, deleteGame } = require("../controllers/gameController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getGames);
router.get("/:gameId", getGame);
router.post("/", protect, adminOnly, createGame);
router.put("/:gameId", protect, adminOnly, updateGame);
router.delete("/:gameId", protect, adminOnly, deleteGame);

module.exports = router;