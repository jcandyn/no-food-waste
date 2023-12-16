import express from "express";
const router = express.Router();
import {
  getItemNameStatistics,
  getWeeklyExpirations,
} from "../data/analytics.js";

router.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  try {
    const userId = req.session.user.id;

    const itemNameStatistics = await getItemNameStatistics(userId);

    const weeklyExpirations = await getWeeklyExpirations(userId);

    // Pass data to Handlebars
    res.render("analytics", {
      data: JSON.stringify(itemNameStatistics),
      weeklyExpirations: JSON.stringify(weeklyExpirations),
      name: req.session.user.name,
    });
  } catch (error) {
    console.error(error);
    // Handle errors and render an error page
    res.render("error", {
      error: "An error occurred while processing analytics data.",
    });
  }
});

export default router;
