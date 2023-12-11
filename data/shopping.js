import { ObjectId } from "mongodb";
import { shoppingCollection } from "./index.js";
import help from "../validation.js";

const exportedMethods = {
  async addItem(userId, items) {
    userId = help.checkId(userId, "User Id");

    const newShoppingList = {
      userId: userId,
      items: items,
    };

    const insertInfo = await shoppingCollection.insertOne(newShoppingList);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw "Could not add shopping list";
    }

    const newId = insertInfo.insertedId.toString();
    const shoppingList = await shoppingCollection.findOne({
      _id: new ObjectId(newId),
    });
    if (shoppingList === null) {
      throw "No shopping list with that id";
    }
    shoppingList._id = shoppingList._id.toString();

    return shoppingList;
  },

  async createShoppingList(userId, items) {
    userId = help.checkId(userId, "User Id");

    // Check if the user already has a shopping list
    const existingShoppingList = await shoppingCollection.findOne({
      userId: userId,
    });

    if (existingShoppingList) {
      // User already has a shopping list, return it
      existingShoppingList._id = existingShoppingList._id.toString();
      return existingShoppingList;
    }

    // If the user doesn't have a shopping list, create a new one
    const newShoppingList = {
      userId: userId,
      items: items,
    };

    const insertInfo = await shoppingCollection.insertOne(newShoppingList);

    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw `Could not create shopping list for user with id ${userId}`;
    }

    const newId = insertInfo.insertedId.toString();
    const shoppingList = await shoppingCollection.findOne({
      _id: new ObjectId(newId),
    });

    if (!shoppingList) {
      throw `No shopping list found for user with id ${userId}`;
    }

    shoppingList._id = shoppingList._id.toString();
    return shoppingList;
  },

  async addItemToShoppingListByUserId(userId, newItem) {
    userId = help.checkId(userId, "User Id");

    const updateInfo = await shoppingCollection.updateOne(
      { userId: userId },
      { $push: { items: newItem } }
    );

    if (updateInfo.modifiedCount === 0) {
      // If no document matched the userId, create a new shopping list
      const newShoppingList = {
        userId: userId,
        items: [newItem], // Create a new array with the newItem
      };

      const insertInfo = await shoppingCollection.insertOne(newShoppingList);
      if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw `Could not add item to shopping list for user with id ${userId}`;
      }

      const newId = insertInfo.insertedId.toString();
      const shoppingList = await shoppingCollection.findOne({
        _id: new ObjectId(newId),
      });
      if (shoppingList === null) {
        throw `No shopping list found for user with id ${userId}`;
      }
      shoppingList._id = shoppingList._id.toString();

      return shoppingList;
    }

    // Document with userId exists, fetch and return it
    const shoppingList = await shoppingCollection.findOne({ userId: userId });
    if (shoppingList === null) {
      throw `No shopping list found for user with id ${userId}`;
    }
    shoppingList._id = shoppingList._id.toString();

    return shoppingList;
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

    const shoppingList = await shoppingCollection.findOne({ userId: userId });

    if (!shoppingList) {
      return null; // Return null if no shopping list is found
    }
    shoppingList._id = shoppingList._id.toString();

    return shoppingList;
  },
};

export default exportedMethods;
