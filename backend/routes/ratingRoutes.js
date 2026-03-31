const express = require("express");
const router = express.Router();
const { rateGame, unrateGame, getMyRatings } = require("../controllers/ratingController");
const { protect } = require("../middleware/authMiddleware");

router.get("/my", protect, getMyRatings);
router.post("/", protect, rateGame);
router.delete("/:gameNumber", protect, unrateGame);

module.exports = router;