import express from "express";
const router = express.Router();
import {
  getExpiryStatusStatistics,
  getCategoryStatistics,
  getUnitStatistics,
  getItemNameStatistics,
} from "../data/analytics.js";

// Example analytics route
router.get("/", async (req, res) => {
  console.log("hitting analytics");
  try {
    const userId = req.session.user.id;

    // Retrieve data using your data functions

    const foodItems = await getExpiryStatusStatistics(userId);
    const units = await getUnitStatistics(userId);
    const category = await getCategoryStatistics(userId);
    const itemNameStatistics = await getItemNameStatistics(userId);
    console.log("Item Name Statistics:", itemNameStatistics);
    // const expiredItemsByWeek = calculateExpiredItemsByWeek(foodItems);
    // const totalCostForUser = calculateTotalCost(foodItems);
    // const itemsByCategory = calculateItemsByCategory(foodItems);

    console.log("food items: ", foodItems);
    console.log("units: ", units);
    console.log("category: ", category);

    // Pass data to Handlebars
    res.render("analytics", {
      foodItems: JSON.stringify(foodItems),
      units: JSON.stringify(units),
      status: JSON.stringify(category),
      name: req.session.user.name,
    });

    // Implement analytics logic here and create data for visualization
  } catch (error) {
    console.error(error);
    // Handle errors and render an error page
    res.render("error", {
      error: "An error occurred while processing analytics data.",
    });
  }
});

export default router;
