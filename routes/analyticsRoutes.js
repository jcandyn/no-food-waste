import express from "express";
const router = express.Router();
// const FoodItem = require("../models/foodItem");

// Example analytics route
router.get("/analytics", async (req, res) => {
  const user = req.user;

  const foodItems = await FoodItem.find({ user: user._id }).exec();
  // Implement analytics logic here and create data for visualization

  res.render("analytics", { foodItems, analyticsData }); // Use Handlebars to render analytics data
});

export default router;
