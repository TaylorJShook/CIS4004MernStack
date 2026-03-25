const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
    {
        gameNumber:
        {
            type: Number,
            unique: true,
            required: true,
        },
        title:
        {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description:
        {
            type: String,
            required: true,
            trim: true,
        },
        coverImageUrl:
        {
            type: String,
            required: true,
            trim: true,
        },
        createdBy:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        genres: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Genre",
                required: true,
            }
        ],
        platforms: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Platform",
                required: true,
            }
        ],
        totalRatings:
        {
            type: Number,
            default: 0,
            required: true,
            min: 0,
        },
        positiveRatings:
        {
            type: Number,
            default: 0,
            required: true,
            min: 0,
        }
    },
    { timestamps: true }
);

gameSchema.virtual("positivePercentage").get(function() {
    if (this.totalRatings === 0) {
        return 0;
    }
    return Math.round((this.positiveRatings / this.totalRatings) * 100);
});

gameSchema.set("toJSON", { virtuals: true });
gameSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Game", gameSchema);
