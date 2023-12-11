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

  async removeShoppingListItemById(itemId) {
    itemId = help.checkId(itemId, "Item Id");

    const updateInfo = await shoppingCollection.updateOne(
      { "items._id": new ObjectId(itemId) },
      { $pull: { items: { _id: new ObjectId(itemId) } } }
    );

    if (updateInfo.modifiedCount === 0) {
      throw `Could not remove item with id ${itemId} from shopping list`;
    }

    const shoppingList = await shoppingCollection.findOne({
      "items._id": new ObjectId(itemId),
    });
    if (shoppingList === null) {
      throw `No shopping list found containing item with id ${itemId}`;
    }
    shoppingList._id = shoppingList._id.toString();

    return shoppingList;
  },

  async removeShoppingListByUserId(userId) {
    userId = help.checkId(userId, "User Id");

    const deleteInfo = await shoppingCollection.deleteOne({ userId: userId });
    if (deleteInfo.deletedCount === 0) {
      throw `Could not remove shopping list for user with id ${userId}`;
    }

    return { userId: userId, deleted: true };
  },

  async getShoppingListByUserId(userId) {
    userId = help.checkId(userId, "User Id");

    const shoppingList = await shoppingCollection.findOne({ userId: userId });
    if (shoppingList === null) {
      throw `No shopping list found for user with id ${userId}`;
    }
    shoppingList._id = shoppingList._id.toString();

    return shoppingList;
  },
};

export default exportedMethods;
