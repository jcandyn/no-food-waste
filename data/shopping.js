import { ObjectId } from "mongodb";
import { shoppingCollection } from "./index.js";
import help from "../validation.js";

const exportedMethods = {
  async createShoppingList(userId, items) {
    userId = help.checkId(userId, "User Id");
    let result;

    // Check if the user already has a shopping list
    let existingShoppingList = await shoppingCollection.findOne({
      userId: userId,
    });

    if (existingShoppingList) {
      // User already has a shopping list, return it
      result = existingShoppingList;
    } else {
      // If the user doesn't have a shopping list, create a new one
      const newShoppingList = {
        userId: userId,
        items: items,
      };

      const insertInfo = await shoppingCollection.insertOne(newShoppingList);

      if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw `Could not create shopping list for user with id ${userId}`;
      }

      result = await shoppingCollection.findOne({
        _id: insertInfo.insertedId,
      });
    }

    //console.log("POST result in data functions: ", result);
    return result;
  },
  async addItemToShoppingListByUserId(userId, newItem) {
    let result;
    userId = help.checkId(userId, "User Id");

    // Find the shopping list for the user
    const existingShoppingList = await shoppingCollection.findOne({
      userId: userId,
    });

    if (!existingShoppingList) {
      // If the user doesn't have a shopping list, create a new one
      const newShoppingList = {
        userId: userId,
        items: [newItem],
      };

      const insertInfo = await shoppingCollection.insertOne(newShoppingList);

      if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw `Could not add item to shopping list for user with id ${userId}`;
      }

      const newId = insertInfo.insertedId.toString();
      const createdShoppingList = await shoppingCollection.findOne({
        _id: new ObjectId(newId),
      });

      if (createdShoppingList === null) {
        throw `No shopping list found for user with id ${userId}`;
      }

      result = createdShoppingList;
    } else {
      // Check if the item already exists in the shopping list
      if (existingShoppingList.items.includes(newItem)) {
        console.log("existing shopping list: ", existingShoppingList);
        console.log("existingShoppingList items: ", existingShoppingList.items);
        console.log("newItem: ", newItem);
        // If the item already exists, return an error message
        throw "No duplicates allowed";
      }

      // Add the new item to the shopping list
      existingShoppingList.items.push(newItem);
    }

    // Update the shopping list in the database
    result = await shoppingCollection.updateOne(
      { userId: userId },
      { $set: { items: existingShoppingList.items } }
    );

    if (result.modifiedCount === 0) {
      throw `Could not update shopping list for user with id ${userId}`;
    }

    result = await shoppingCollection.findOne({
      userId: userId,
    });

    return result;
  },
  async removeItemFromShoppingList(userId, itemName) {
    userId = help.checkId(userId, "User Id");

    try {
      // Find the shopping list for the user
      const shoppingList = await shoppingCollection.findOne({
        userId: userId,
      });

      if (!shoppingList) {
        throw `Shopping list not found for user with id ${userId}`;
      }

      // Find the index of the item in the array
      const index = shoppingList.items.indexOf(itemName);

      if (index === -1) {
        console.log(" not found itemName: ", itemName);
        throw `Item ${itemName} not found in the shopping list`;
      }

      // Remove the item from the array
      shoppingList.items.splice(index, 1);

      // Update the shopping list in the database
      const updateResult = await shoppingCollection.updateOne(
        { userId: userId },
        { $set: { items: shoppingList.items } }
      );

      if (updateResult.modifiedCount === 0) {
        throw `Could not update shopping list for user with id ${userId}`;
      }

      return shoppingList;
    } catch (error) {
      console.error("Error removing item from shopping list:", error);
      throw error; // Re-throw the error for the caller to handle
    }
  },

  async getShoppingListByUserId(userId) {
    userId = help.checkId(userId, "User Id");

    let shoppingList = await shoppingCollection.findOne({ userId: userId });

    if (!shoppingList) {
      shoppingList = null; // Return null if no shopping list is found
    }

    return shoppingList;
  },
};

export default exportedMethods;
