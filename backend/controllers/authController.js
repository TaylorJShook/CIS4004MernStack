const User = require("../models/user");
const Rating = require("../models/rating");
const Game = require("../models/game");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const createUser = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is required" });
    }

    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Find the highest existing userNumber
    const maxUser = await User.findOne({ userNumber: { $exists: true } })
      .sort({ userNumber: -1 })
      .select("userNumber");

    const nextUserNumber = maxUser ? maxUser.userNumber + 1 : 1;

    const user = new User({
      userNumber: nextUserNumber,
      username,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user",
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        userNumber: user.userNumber,
        username: user.username,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Duplicate username or userNumber detected",
      });
    }

    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is required" });
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        userNumber: user.userNumber,
        username: user.username,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ userNumber: 1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

//added - lets admin delete a user and clean up all their ratings from the database
const deleteUser = async (req, res) => {
  try {
    if (req.params.userId === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove all ratings left by this user and update game counters
    const userRatings = await Rating.find({ user: user._id });
    for (const rating of userRatings) {
      const game = await Game.findById(rating.game);
      if (game) {
        game.totalRatings -= 1;
        if (rating.vote === "up") game.positiveRatings -= 1;
        await game.save();
      }
    }
    await Rating.deleteMany({ user: user._id });

    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createUser, getUsers, login, getMe, deleteUser };