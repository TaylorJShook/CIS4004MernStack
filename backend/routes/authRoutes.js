const express = require("express");
const router = express.Router();
const { createUser, getUsers, login, getMe } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/create", createUser);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/users", protect, adminOnly, getUsers);

module.exports = router;