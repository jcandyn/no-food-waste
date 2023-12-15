import express from "express";
const router = express.Router();
import foodData from "../data/foods.js";
import help from "../validation.js";
import fetch from "node-fetch";
import { getUserInfo } from "../data/users.js";
import xss from "xss";

import { config } from "dotenv";
config();

const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;

import { findExpirations } from "../data/expirations.js";

let userId;
let foodList;
// Create a new food item
router
  .route("/")
  .get(async (req, res) => {
    if (!req.session.user) {
      return res.redirect("/");
    }

    try {
      let expirationNotifications;
      const date = new Date();
      if (req.session.user) {
        expirationNotifications = await findExpirations(req.session.user);
      }

      console.log("expiration being passed down: ", expirationNotifications);
      userId = help.checkId(req.session.user.id, "User Id");
      foodList = await foodData.getFoodByUserId(userId);
      // Retrieve user info
      const userInfo = await getUserInfo(userId);
      res.render("inventory", {
        foodList: foodList,
        name: req.session.user.name,
        userId: req.session.user.id,
        phoneNumber: userInfo.phoneNumber,
        expirationNotifications: JSON.stringify(expirationNotifications),
      });
    } catch (e) {
      return res.status(500).render("error", { error: e });
    }
  })
  .post(async (req, res) => {
    let foodInfo = req.body;
    if (!foodInfo || Object.keys(foodInfo).length === 0) {
      return res
        .status(400)
        .render("error", { error: "There are no fields in the request body" });
    }

    let {
      itemName,
      quantity,
      unit,
      expiryDate,
      costPerItem,
      totalCost,
      brand,
      category,
      status,
    } = foodInfo;

    itemName = xss(itemName);
    quantity = xss(quantity);
    unit = xss(unit);
    expiryDate = xss(expiryDate);
    costPerItem = xss(costPerItem);
    totalCost = xss(totalCost);
    brand = xss(brand);
    category = xss(category);
    status = xss(status);

    let error = [];
    try {
      itemName = help.checkString(itemName, "Item Name");
    } catch (e) {
      error.push(e);
    }
    try {
      quantity = help.checkNum(quantity, "Quantity");
    } catch (e) {
      error.push(e);
    }
    try {
      unit = help.checkUnit(unit);
    } catch (e) {
      error.push(e);
    }
    try {
      expiryDate = help.checkDate(expiryDate, "Expiry Date");
    } catch (e) {
      error.push(e);
    }
    try {
      costPerItem = help.checkNum(costPerItem, "Cost per Item");
    } catch (e) {
      error.push(e);
    }
    try {
      totalCost = help.checkNum(totalCost, "Total Cost");
    } catch (e) {
      error.push(e);
    }

    try {
      brand = help.checkString(brand, "Brand");
    } catch (e) {
      error.push(e);
    }
    try {
      category = help.checkCategory(category, "Category");
    } catch (e) {
      error.push(e);
    }
    try {
      status = help.checkStatus(status, "Status");
    } catch (e) {
      error.push(e);
    }
    if (error.length > 0) {
      return res.status(400).render("inventory", {
        foodList: foodList,
        name: req.session.user.name,
        hasErrors: true,
        error: error,
      });
    }

    const searchWord = itemName;

    let imageUrl;

    await fetch(
      `https://api.unsplash.com/photos/random?query=${searchWord}&client_id=${UNSPLASH_API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        imageUrl = data.urls.regular;
      })
      .catch((error) => console.error("Error fetching image:", error));

    let snoozed = false; // default

    try {
      const foodItem = await foodData.addFood(
        userId,
        itemName,
        quantity,
        unit,
        expiryDate,
        costPerItem,
        totalCost,
        brand,
        category,
        status,
        imageUrl,
        snoozed
      );

      return res.status(200).redirect("/");
    } catch (e) {
      return res.status(500).render("error", { error: e });
    }
  });

router.get("/:Id", async (req, res) => {
  try {
    const userId = help.checkId(req.params.Id, "User Id");
    const food = await foodData.getFoodByUserId(userId);

    if (!food) {
      return res.status(404).render("error", { error: "Food not found" });
    }

    return res.json(food);
  } catch (e) {
    console.error("Error getting food by user id:", e);
    return res.status(500).render("error", { error: "Internal server error" });
  }
});

router.post("/snooze/:id", async (req, res) => {
  try {
    const foodId = help.checkId(req.params.id, "Food Id");
    const snoozed = req.body.snoozed; // true or false

    const updatedFood = await foodData.updateFoodSnoozeStatus(foodId, snoozed);

    return res.status(200).json(updatedFood);
  } catch (e) {
    console.error("Error updating snooze status:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router
  .route("/view/:Id")
  .get(async (req, res) => {
    if (!req.session.user) {
      return res.redirect("/");
    }
    try {
      req.params.Id = help.checkId(req.params.Id, "Food Id");
    } catch (e) {
      return res.status(400).render("error", { error: e });
    }
    try {
      let food = await foodData.getFoodById(req.params.Id);
      return res.render("singleview", {
        food: food,
        foodId: req.params.Id,
        hasErrors: false,
        name: req.session.user.name,
      });
    } catch (e) {
      console.error("Error getting food by ID:", e);
      return res.redirect("/");
    }
  })
  .delete(async (req, res) => {
    try {
      req.params.Id = help.checkId(req.params.Id, "Food Id");
    } catch (e) {
      return res.status(400).render("error", { error: e });
    }
    try {
      await foodData.getFoodById(req.params.Id);
    } catch (e) {
      return res.status(404).render("error", { error: e });
    }
    try {
      const deleteFood = await foodData.removeFood(req.params.Id);
      return res.status(200).redirect("/");
      //return res.json(deleteFood);
    } catch (e) {
      return res.status(500).render("error", { error: e });
    }
  })
  .put(async (req, res) => {
    //code here for PUT
    let updateData = req.body;
    let food;
    if (!updateData || Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .render("error", { error: "There are no fields in the request body" });
    }
    try {
      req.params.Id = help.checkId(req.params.Id, "Food Id");
    } catch (e) {
      return res.status(400).render("error", { error: e });
    }
    try {
      food = await foodData.getFoodById(req.params.Id);
    } catch (e) {
      return res.status(404).render("error", { error: e });
    }

    let {
      userId,
      itemName,
      quantity,
      unit,
      expiryDate,
      costPerItem,
      totalCost,
      brand,
      category,
      status,
    } = updateData;
    itemName = xss(itemName);
    quantity = xss(quantity);
    unit = xss(unit);
    expiryDate = xss(expiryDate);
    costPerItem = xss(costPerItem);
    totalCost = xss(totalCost);
    brand = xss(brand);
    category = xss(category);
    status = xss(status);
    try {
      userId = help.checkId(req.session.user.id, "User Id");
    } catch (e) {
      return res.status(400).render("error", { error: e });
    }
    let error = [];
    try {
      itemName = help.checkString(itemName, "Item Name");
    } catch (e) {
      error.push(e);
    }
    try {
      quantity = help.checkNum(quantity, "Quantity");
    } catch (e) {
      error.push(e);
    }
    try {
      unit = help.checkUnit(unit);
    } catch (e) {
      error.push(e);
    }
    try {
      expiryDate = help.checkDate(expiryDate, "Expiry Date");
    } catch (e) {
      error.push(e);
    }
    try {
      costPerItem = help.checkNum(costPerItem, "Cost per Item");
    } catch (e) {
      error.push(e);
    }
    try {
      totalCost = help.checkNum(totalCost, "Total Cost");
    } catch (e) {
      error.push(e);
    }

    try {
      brand = help.checkString(brand, "Brand");
    } catch (e) {
      error.push(e);
    }
    try {
      category = help.checkCategory(category, "Category");
    } catch (e) {
      error.push(e);
    }
    try {
      status = help.checkStatus(status, "Status");
    } catch (e) {
      error.push(e);
    }
    if (error.length > 0) {
      return res.status(400).render("singleview", {
        food: food,
        foodId: req.params.Id,
        hasErrors: true,
        error: error,
      });
    }
    try {
      const updateFood = await foodData.updateFood(
        req.params.Id,
        userId,
        itemName,
        quantity,
        unit,
        expiryDate,
        costPerItem,
        totalCost,
        brand,
        category,
        status
      );
      return res.render("singleview", {
        food: updateFood,
        foodId: req.params.Id,
      });
    } catch (e) {
      return res.status(500).render("error", { error: e });
    }
  });

// route to get foods by user id
// not getting used right now
router.get("/:userId", async (req, res) => {
  try {
    const userId = help.checkId(req.session.user.id, "User Id");
    const food = await foodData.getFoodByUserId(userId);

    if (!food) {
      return res.status(404).render("error", { error: "Food not found" });
    }

    return res.json(food);
  } catch (e) {
    console.error("Error getting food by user id:", e);
    return res.status(500).render("error", { error: "Internal server error" });
  }
});

export default router;
