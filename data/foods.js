// import userData from "./users.js";
import { ObjectId } from "mongodb";
import { foodCollection } from "./index.js";
import help from "../validation.js";

const exportedMethods = {
  async addFood(
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
  ) {
    itemName = help.checkString(itemName, "Item Name");
    quantity = help.checkNum(quantity, "Quantity");
    unit = help.checkUnit(unit);
    expiryDate = help.checkDate(expiryDate, "Expiry Date"); 
    costPerItem = help.checkNum(costPerItem, "Cost per Item");
    totalCost = help.checkNum(totalCost, "Total Cost");
    brand = help.checkString(brand, "Brand");
    category = help.checkCategory(category, "Category");
    status = help.checkStatus(status, "Status");

    //  Create a new document
    let newFoodItem = {
      userId: userId, // this should come from somewhere else
      itemName: itemName,
      quantity: quantity,
      unit: unit,
      expiryDate: expiryDate,
      costPerItem: costPerItem,
      totalCost: totalCost,
      brand: brand,
      category: category,
      status: status,
      imageUrl: imageUrl,
      snoozed: false
    };

    const insertInfo = await foodCollection.insertOne(newFoodItem);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Could not add food item";

    const newId = insertInfo.insertedId.toString();
    const food = await foodCollection.findOne({ _id: new ObjectId(newId) });
    if (food === null) throw "No food with that id";
    food._id = food._id.toString();

    return food;
  },

  async getAllFood() {
    let foodList = await foodCollection
      .find({})
      .project({ _id: 1, itemName: 1, expiryDate: 1, imageUrl: 1, snoozed: 1 })
      .toArray();
    if (!foodList) throw "Could not get all food";

    foodList = foodList.map((element) => {
      element._id = element._id.toString();
      return element;
    });

    return foodList;
  },
  async getFoodById(foodId) {
    if (!ObjectId.isValid(foodId)) throw "invalid object ID";
    foodId = help.checkId(foodId, "Food Id");

    const food = await foodCollection.findOne({ _id: new ObjectId(foodId) });
    if (food === null) throw `No food with that id: ${foodId}`;
    food._id = food._id.toString();
    return food;
  },
  async removeFood(foodId) {
    if (!ObjectId.isValid(foodId)) throw "invalid object ID";
    foodId = help.checkId(foodId, "Food Id");

    const DeleteInfo = await foodCollection.findOneAndDelete({
      _id: new ObjectId(foodId),
    });
    if (!DeleteInfo) {
      throw `Could not delete food of provided id: ${foodId}`;
    }
    let deletedObj = { itemName: DeleteInfo.itemName, deleted: true };
    return deletedObj;
  },
  async updateFood(
    foodId,
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
  ) {
    foodId = help.checkId(foodId, "Food Id");
    userId = help.checkId(userId, "User Id");
    itemName = help.checkString(itemName, "Item Name");
    quantity = help.checkNum(quantity, "Quantity");
    unit = help.checkUnit(unit);
    expiryDate = help.checkDate(expiryDate, "Expiry Date");
    costPerItem = help.checkNum(costPerItem, "Cost per Item");
    totalCost = help.checkNum(totalCost, "Total Cost");
    brand = help.checkString(brand, "Brand");
    category = help.checkCategory(category, "Category");
    status = help.checkStatus(status, "Status");

    let FoodItem = {
      _id: new ObjectId(foodId),
      userId: userId, // this should come from somewhere else
      itemName: itemName,
      quantity: quantity,
      unit: unit,
      expiryDate: expiryDate,
      costPerItem: costPerItem,
      totalCost: totalCost,
      brand: brand,
      category: category,
      status: status,
    };

    const updateInfo = await foodCollection.findOneAndUpdate(
      { _id: new ObjectId(foodId) },
      { $set: FoodItem },
      { returnDocument: "after" }
    );
    if (!updateInfo)
      throw `Error: Update failed! Could not update inventory with id ${foodId}`;

    return updateInfo;
  },
  // get all foods by user id
  async getFoodByUserId(userId) {
    if (!ObjectId.isValid(userId)) throw "Invalid User ID";
    userId = help.checkId(userId, "User Id");

    let foodList = await foodCollection
      .find({ userId: userId })
      .project({
        _id: 1,
        itemName: 1,
        expiryDate: 1,
        imageUrl: 1,
        quantity: 1,
        unit: 1,
        snoozed: 1,
      })
      .toArray();

    if (!foodList) throw "Could not get all food for the user";

    foodList = foodList.map((element) => {
      element._id = element._id.toString();
      return element;
    });

    return foodList;
  },

  async updateFoodSnoozeStatus(foodId, snoozed) {
    foodId = help.checkId(foodId, "Food Id");
    //console.log("food id passed to update function: ", foodId);
    console.log("snoozed : ", snoozed);

    let updateInfo;
    try {
      updateInfo = await foodCollection.findOneAndUpdate(
        { _id: new ObjectId(foodId) },
        { $set: { snoozed: snoozed } },
        { returnDocument: "after" }
      );
    } catch (e) {
      console.log(e);
    }

    //console.log(updateInfo);

    if (!updateInfo)
      throw `Error: Update failed! Could not update snooze status for food with id ${foodId}`;

    return updateInfo;
  },
};

export default exportedMethods;
