const mongoose = require('mongoose');

const platformSchema = new mongoose.Schema(
    {
        platformNumber:
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

module.exports = mongoose.model("Platform", platformSchema);