const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
    {
        ratingNumber:
        {
            type: Number,
            unique: true,
            required: true,
        },
        user:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        game:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Game",
            required: true,
        },
        vote:
        {
            type: String,
            enum: ["up", "down"],
            required: true,
        },
    },
    { timestamps: true }
);

ratingSchema.index({ user: 1, game: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);