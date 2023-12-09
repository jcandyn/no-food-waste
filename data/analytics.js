// import userData from "./users.js";
import { ObjectId } from "mongodb";
import { foodCollection } from "./index.js";
import help from "../validation.js";

export const getItemNameStatistics = async (userId) => {
  try {
    // Validate user ID
    if (!ObjectId.isValid(userId)) throw "Invalid User ID";
    userId = help.checkId(userId, "User Id");

    // Aggregate query to get itemName statistics
    const itemNameStatistics = await foodCollection
      .aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: {
              itemName: "$itemName",
              month: {
                $month: { $dateFromString: { dateString: "$expiryDate" } },
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: "$_id.month",
            items: {
              $push: {
                itemName: "$_id.itemName",
                count: "$count",
              },
            },
          },
        },
        { $project: { _id: 0, month: "$_id", items: 1 } },
      ])
      .toArray();

    // Transform the result into the desired format
    const result = itemNameStatistics.map((entry) => {
      const item = { month: getMonthName(entry.month) };
      entry.items.forEach((itemEntry) => {
        item[itemEntry.itemName] = itemEntry.count;
      });
      return item;
    });

    return result;
  } catch (error) {
    console.error("Error getting itemName statistics:", error);
    throw error;
  }
};

// Helper function to get month name from month number
const getMonthName = (month) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[month - 1] || null;
};

export const getExpiryStatusStatistics = async (userId) => {
  if (!ObjectId.isValid(userId)) throw "Invalid User ID";
  userId = help.checkId(userId, "User Id");

  const statusStatistics = await foodCollection
    .aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, status: "$_id", count: 1 } },
    ])
    .toArray();

  return statusStatistics;
};

export const getCategoryStatistics = async (userId) => {
  if (!ObjectId.isValid(userId)) throw "Invalid User ID";
  userId = help.checkId(userId, "User Id");

  const categoryStatistics = await foodCollection
    .aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, category: "$_id", count: 1 } },
    ])
    .toArray();

  return categoryStatistics;
};

export const getUnitStatistics = async (userId) => {
  if (!ObjectId.isValid(userId)) throw "Invalid User ID";
  userId = help.checkId(userId, "User Id");

  const unitStatistics = await foodCollection
    .aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$unit",
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, unit: "$_id", count: 1 } },
    ])
    .toArray();

  return unitStatistics;
};
