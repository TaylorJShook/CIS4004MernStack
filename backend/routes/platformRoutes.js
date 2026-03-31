const express = require("express");
const router = express.Router();
const { getPlatforms } = require("../controllers/platformController");

router.get("/", getPlatforms);

module.exports = router;