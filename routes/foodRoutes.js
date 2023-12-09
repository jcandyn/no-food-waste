import express from "express";
const router = express.Router();
import foodData from "../data/foods.js";
import help from "../validation.js";
import fetch from "node-fetch";

import { foodExpirationsMiddleware } from "../middleware.js";

let userId;
let foodList;
// Create a new food item
router
  .route("/")
  .get(foodExpirationsMiddleware, async (req, res) => {
    try {
      const date = new Date();
      userId = help.checkId(req.session.user.id, "User Id");
      foodList = await foodData.getFoodByUserId(userId);
      res.render("inventory", {
        foodList: foodList,
        name: req.session.user.name,
        userId: req.session.user.id,
      });
    } catch (e) {
      return res.status(500).render("error", { error: e });
    }
    return;
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
      category = help.checkString(category, "Category");
    } catch (e) {
      error.push(e);
    }
    try {
      status = help.checkString(status, "Status");
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

    const apiKey = "0A0cwRBFJMQvKubVKnQJO2wYQTVnxTNY35cFJxXAnyg";
    const searchWord = itemName; // Replace with the word you want to search for

    let imageUrl;

    await fetch(
      `https://api.unsplash.com/photos/random?query=${searchWord}&client_id=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        imageUrl = data.urls.regular;
      })
      .catch((error) => console.error("Error fetching image:", error));

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
        imageUrl
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

router
  .route("/view/:Id")
  .get(async (req, res) => {
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
      //return res.json(food);
    } catch (e) {
      return res.status(404).render("error", { error: e });
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
      category = help.checkString(category, "Category");
    } catch (e) {
      error.push(e);
    }
    try {
      status = help.checkString(status, "Status");
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
