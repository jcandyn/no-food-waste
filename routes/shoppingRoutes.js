import express from "express";
import shopping from "../data/shopping.js";
import { printMiddleware } from "../middleware.js";
import help from "../validation.js";

const router = express.Router();

// Get all items in the shopping list
router.route("/").get(printMiddleware, async (req, res) => {
  try {
    const userId = req.session.user
      ? help.checkId(req.session.user.id, "User Id")
      : null;

    if (!userId) {
      // Handle the case where req.session.user is not defined or doesn't have an 'id' property
      res.redirect("/");
      return;
    }
    const shoppingList = await shopping.getShoppingListByUserId(userId);

    if (!shoppingList || shoppingList.length === 0) {
      // No shopping list found
      res.render("shopping", {
        name: req.session.user.name,
        errorMessage: "No shopping list yet, start adding items to create one.",
      });
    } else {
      // Shopping list found
      res.render("shopping", {
        shoppingList: shoppingList,
        name: req.session.user.name,
      });
    }
  } catch (error) {
    console.error("Error getting shopping list:", error);

    if (
      typeof error === "string" &&
      error.includes("No shopping list found for user with id")
    ) {
      return res.render("shopping", {
        name: req.session.user.name,
        errorMessage: "No shopping list yet, start adding items to create one.",
      });
    }

    // Log the error details for further investigation
    console.error("Unhandled error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.route("/").post(printMiddleware, async (req, res) => {
  if (!req.session.user) {
    res.redirect("/");
    return;
  }

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

    let success;
    if (shoppingList) {
      success = "success adding";
    } else {
      success = "error adding";
    }

    res.status(200).send({ shoppingList: shoppingList });
  } catch (error) {
    console.error("Error adding item to shopping list:", error);

    // Send the error message to the client side with a 400 status code
    res.status(400).send({ error: error || "Internal server error" });
  }
});

// Remove an item from the shopping list
router.delete("/delete", async (req, res) => {
  try {
    const userId = help.checkId(req.session.user.id, "User Id");
    const { itemName } = req.body;
    console.log("delete itemName: ", itemName);

    const shoppingList = await shopping.removeItemFromShoppingList(
      userId,
      itemName
    );

    let success;
    if (shoppingList) {
      success = "success deleting";
    } else {
      success = "error deleting";
    }

    res.status(200).send({ shoppingList: shoppingList });
  } catch (error) {
    console.error("Error removing item from shopping list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
