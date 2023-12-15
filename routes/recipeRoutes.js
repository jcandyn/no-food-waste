import express from "express";
import foodsData from "../data/foods.js";
import { findRecipesByIngredients } from "../data/recipes.js";
import { config } from "dotenv";
config();

import axios from "axios";

const router = express.Router();

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

router.get("/", async (req, res) => {
  console.log("Accessing /recipes route");

  if (!req.session || !req.session.user) {
    // If not authenticated, redirect to login
    return res.redirect("/");
  }
  try {
    const userId = req.session.user.id;
    const inventoryItems = await foodsData.getFoodByUserId(userId);
    let hasIngredients = inventoryItems && inventoryItems.length > 0;

    res.render("recipes", {
      layout: "main",
      name: req.session.user.name,
      hasIngredients,
      inventoryItems,
    });
  } catch (error) {
    console.error("Error in /recipes route:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/fetch-recipes", async (req, res) => {
  try {
    const ingredient = req.query.ingredient;
    const recipes = await findRecipesByIngredients([ingredient]);
    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ message: "Error fetching recipes" });
  }
});

router.get("/recipe-info/:id", async (req, res) => {
  const recipeId = req.params.id;
  //   console.log(`Backend: Received request for recipe ID: ${recipeId}`);

  if (!recipeId) {
    return res.status(400).json({ error: "No recipe ID provided" });
  }

  const url = `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=false&apiKey=${SPOONACULAR_API_KEY}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Backend: Error fetching recipe details:", error);
    res.status(500).json({ error: "Error fetching recipe details" });
  }
});

export default router;
