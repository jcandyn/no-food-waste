import express from "express";
import shopping from "../data/shopping.js";
import { printMiddleware } from "../middleware.js";
import help from "../validation.js";

const router = express.Router();

// Get all items in the shopping list
router.route("/").get(printMiddleware, async (req, res) => {
  if (!req.session.user) {
    res.redirect("/");
  }

  try {
    const userId = help.checkId(req.session.user.id, "User Id");
    const shoppingList = await shopping.getShoppingListByUserId(userId);
    res.render("shopping", {
      shoppingList: shoppingList,
      name: req.session.user.name,
    });
  } catch (error) {
    console.error("Error getting shopping list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const userId = help.checkId(req.session.user.id, "User Id");
    const { itemName } = req.body;

    let shoppingList = await shopping.getShoppingListByUserId(userId);

    if (!shoppingList) {
      // If the user doesn't have a shopping list, create a new one
      shoppingList = await shopping.createShoppingList(userId, [itemName]);
    } else {
      // If the user already has a shopping list, add the item to the existing list
      shoppingList = await shopping.addItemToShoppingListByUserId(
        userId,
        itemName
      );
    }

    if (shoppingList) {
      success = "success adding";
    } else {
      success = "error adding";
    }

    res.render("shopping", {
      success: success,
      shoppingList: shoppingList,
      name: req.session.user.name,
    });
  } catch (error) {
    console.error("Error adding item to shopping list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Remove an item from the shopping list
router.delete("/:id", async (req, res) => {
  try {
    const itemId = help.checkId(req.params.id, "Item Id");

    const removedItem = await shopping.removeItemFromShoppingList(itemId);
    if (removedItem) {
      success = "success deleting";
    } else {
      success = "error deleting";
    }

    res.render("shopping", {
      success: success,
    });
  } catch (error) {
    console.error("Error removing item from shopping list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
