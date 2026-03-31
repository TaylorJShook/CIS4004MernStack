const express = require("express");
const router = express.Router();
const { createUser, getUsers, login } = require("../controllers/authController");

router.post("/api/auth/create", createUser);
router.post("/api/auth/login", login);
router.get("/api/auth/users", getUsers);



module.exports = router;