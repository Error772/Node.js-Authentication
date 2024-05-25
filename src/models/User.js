const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    tokens: {
        type: Array,
        default: [],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    passwordResetToken: {
        type: String,
        default: null,
    },
    passwordResetTokenExpires: {
        type: Date,
        default: null,
    },
});

userSchema.plugin(timestamp);

const User = mongoose.model("User", userSchema);
module.exports = User;
