const express = require("express");
const cors = require("cors");

const gameRoutes = require("./routes/gameRoutes");
const authRoutes = require("./routes/authRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const genreRoutes = require("./routes/genreRoutes");
const platformRoutes = require("./routes/platformRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API is running"));
app.get("/api/test", (req, res) => res.json({ message: "Backend is working" }));

app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/platforms", platformRoutes);

module.exports = app;