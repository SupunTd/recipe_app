const express = require("express");
const Favorite = require("../models/Favorite");
const axios = require("axios"); // Import axios to make requests to the meal API

const router = express.Router();

// Add a favorite recipe
router.post("/", async (req, res) => {
    const { userId, recipeId } = req.body;

    try {
        const newFavorite = new Favorite({ userId, recipeId });
        await newFavorite.save();
        res.status(201).json({ message: "Favorite added successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error adding favorite", error });
    }
});

// Get favorites by user ID
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const favorites = await Favorite.find({ userId });
        const recipePromises = favorites.map(async (fav) => {
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${fav.recipeId}`);
            return response.data.meals[0]; // Assuming the response structure contains a `meals` array
        });

        const recipes = await Promise.all(recipePromises);
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching favorites", error });
    }
});

// Get favorites all
router.get("/", async (req, res) => {
    try {
        // Find all favorite records
        const favorites = await Favorite.find();
        
        // Make API calls to fetch recipe details for each favorite
        const recipePromises = favorites.map(async (fav) => {
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${fav.recipeId}`);
            return response.data.meals[0]; 
        });

        const recipes = await Promise.all(recipePromises);
        res.status(200).json(recipes);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: "Error fetching favorites", error });
    }
});

// Delete a favorite recipe
router.delete("/", async (req, res) => {
    const { userId, recipeId } = req.body;

    try {
        const result = await Favorite.deleteOne({ userId, recipeId });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Favorite deleted successfully." });
        } else {
            res.status(404).json({ message: "Favorite not found." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting favorite", error });
    }
});

module.exports = router;
