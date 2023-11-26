import express from "express";
const router = express.Router();
import foodData from "../data/foods.js";

// Create a new food item
router.route("/").post(async (req, res) => {
  const {
    itemName,
    quantity,
    unit,
    expiryDate,
    costPerItem,
    totalCost,
    brand,
  } = req.body;

  try {
    await foodData.addFood(
      itemName,
      quantity,
      unit,
      expiryDate,
      costPerItem,
      totalCost,
      brand
    );
    res.status(200).send("Food item added successfully");
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

// Add code for updating and deleting food items
// Set up expiration alert logic

export default router;
