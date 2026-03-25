const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema(
    {
        genreNumber:
        {
            type: Number,
            unique: true,
            required: true,
        },
        name:
        {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Genre", genreSchema);