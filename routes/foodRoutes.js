import express from "express";
const router = express.Router();
// import FoodItem = from "../models/foodItem"; // You need to create this model

// Create a new food item
router.post("/food/add", (req, res) => {
  const { name, expirationDate } = req.body;
  const newFoodItem = new FoodItem({
    name,
    expirationDate,
    user: req.user._id, // Associate with the currently logged in user
  });

  newFoodItem.save((err) => {
    if (err) {
      console.error(err);
      res.redirect("/");
    } else {
      res.redirect("/");
    }
  });
});

// Add code for updating and deleting food items
// Set up expiration alert logic

export default router;
