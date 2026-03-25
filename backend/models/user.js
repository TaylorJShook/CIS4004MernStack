const mongoose = require('mongoose');

const userSchema = new monoose.Schema(
    {
        userNumber:
        {
            type: Number,
            unique: true,
            required: true,
        },
        username:
        {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: 
        {
            type: String,
            required: true,
        },
        role:
        {
            type: String,
            enum: ["admin", "user"],
            default: "user",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = monoose.model("User", userSchema);
