// import userData from "./users.js";
import { ObjectId } from "mongodb";
import { foodCollection } from "./index.js";
import help from "../validation.js";

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
