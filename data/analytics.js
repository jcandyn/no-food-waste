// import userData from "./users.js";
import { ObjectId } from "mongodb";
import { foodCollection } from "./index.js";
import help from "../validation.js";
import { startOfMonth } from "date-fns";

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
            quantity: { $sum: "$quantity" }, // Sum up the quantities
          },
        },
        {
          $group: {
            _id: "$_id.month",
            items: {
              $push: {
                itemName: "$_id.itemName",
                quantity: "$quantity",
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
        item[itemEntry.itemName] = itemEntry.quantity;
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

export const getWeeklyExpirations = async (userId) => {
  try {
    // Validate user ID
    if (!ObjectId.isValid(userId)) throw "Invalid User ID";
    userId = help.checkId(userId, "User Id");

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Format the date as "MM/DD/YYYY"
    const formattedThreshold = `${(oneMonthAgo.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${oneMonthAgo
      .getDate()
      .toString()
      .padStart(2, "0")}/${oneMonthAgo.getFullYear()}`;

    console.log("formatted threshold :", formattedThreshold);

    const formattedCurrentDate = `${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${new Date()
      .getDate()
      .toString()
      .padStart(2, "0")}/${new Date().getFullYear()}`;

    console.log("formatted current :", formattedCurrentDate);

    // Find documents with expiryDate within the last month
    const query = {
      expiryDate: {
        $gte: formattedThreshold,
        $lte: formattedCurrentDate,
      },
      userId: userId,
    };

    const expiringItems = await foodCollection.find(query).toArray();

    // Aggregate query to get weekly expirations
    const weeklyExpirations = expiringItems
      .reduce((result, item) => {
        const expirationDate = new Date(item.expiryDate);
        const startOfMonthDate = startOfMonth(expirationDate);
        const weekNumber = Math.ceil(
          (expirationDate - startOfMonthDate) / (7 * 24 * 60 * 60 * 1000)
        );

        const existingItem = result.find((r) => r.week === weekNumber);

        if (existingItem) {
          existingItem.count += item.quantity;
        } else {
          result.push({ week: weekNumber, count: item.quantity });
        }

        return result;
      }, [])
      .sort((a, b) => a.week - b.week); // Sort by week number

    return weeklyExpirations;
  } catch (error) {
    console.error("Error getting weekly expirations:", error);
    throw error;
  }
};
