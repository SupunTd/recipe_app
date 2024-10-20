
const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User", // Assuming you have a User model
    },
    recipeId: {
        type: String, // You can change this to Number if recipe IDs are numeric
        required: true,
    },
});

module.exports = mongoose.model("Favorite", favoriteSchema);
