import express from "express";
const router = express.Router();
import foodData from "../data/foods.js";
import help from "../validation.js";

let userId;
// Create a new food item
router
  .route("/")
  .get(async (req, res) => {
    try {
      userId = help.checkId(req.session.user.id, "User Id");
      const foodList = await foodData.getFoodByUserId(userId);
      res.render("inventory", {
        foodList: foodList,
        name: req.session.user.name,
      });
    } catch (e) {
      return res.status(500).json({ error: e });
    }
    return;
  })
  .post(async (req, res) => {
    let foodInfo = req.body;
    if (!foodInfo || Object.keys(foodInfo).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
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
    try {
      itemName = help.checkString(itemName, "Item Name");
      quantity = help.checkNum(quantity, "Quantity");
      unit = help.checkUnit(unit);
      expiryDate = help.checkDate(expiryDate, "Expiry Date"); //need to change the validation for date
      costPerItem = help.checkNum(costPerItem, "Cost per Item");
      totalCost = help.checkNum(totalCost, "Total Cost");
      brand = help.checkString(brand, "Brand");
      category = help.checkString(category, "Category");
      status = help.checkString(status, "Status");
    } catch (e) {
      return res.status(400).json({ error: e });
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

      return res.status(200).send("Food item added sucessfully");
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  });

router.get("/:Id", async (req, res) => {
  try {
    const userId = help.checkId(req.params.Id, "User Id");
    const food = await foodData.getFoodByUserId(userId);

    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }

    return res.json(food);
  } catch (e) {
    console.error("Error getting food by user id:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router
  .route("/:Id")
  .get(async (req, res) => {
    try {
      req.params.Id = help.checkId(req.params.Id, "Food Id");
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      let food = await foodData.getFoodById(req.params.Id);
      return res.json(food);
    } catch (e) {
      return res.status(404).json({ error: e });
    }
  })
  .delete(async (req, res) => {
    try {
      req.params.Id = help.checkId(req.params.Id, "Food Id");
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      await foodData.getFoodById(req.params.Id);
    } catch (e) {
      return res.status(404).json({ error: e });
    }
    try {
      const deleteFood = await foodData.removeFood(req.params.Id);
      return res.json(deleteFood);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  })
  .put(async (req, res) => {
    //code here for PUT
    let updateData = req.body;
    if (!updateData || Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }
    try {
      req.params.Id = help.checkId(req.params.Id, "Food Id");
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      await foodData.getFoodById(req.params.Id);
    } catch (e) {
      return res.status(404).json({ error: e });
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
      userId = help.checkId(userId, "User Id");
      itemName = help.checkString(itemName, "Item Name");
      quantity = help.checkNum(quantity, "Quantity");
      unit = help.checkUnit(unit);
      expiryDate = help.checkDate(expiryDate, "Expiry Date");
      costPerItem = help.checkNum(costPerItem, "Cost per Item");
      totalCost = help.checkNum(totalCost, "Total Cost");
      brand = help.checkString(brand, "Brand");
      category = help.checkString(category, "Category");
      status = help.checkString(status, "Status");
    } catch (e) {
      return res.status(400).json({ error: e });
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
      return res.json(updateFood);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  });

// route to get foods by user id
// not getting used right now
router.get("/:userId", async (req, res) => {
  try {
    const userId = help.checkId(req.session.user.id, "User Id");
    const food = await foodData.getFoodByUserId(userId);

    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }

    return res.json(food);
  } catch (e) {
    console.error("Error getting food by user id:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
