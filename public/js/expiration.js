import { foodCollection } from "../../data/index.js";
import { getUserInfo } from "../../data/users.js";
import { config } from "dotenv";

config();

async function findExpirations(user) {
  let result = [];
  try {
    console.log("expirations");

    // Calculate the date 7 days from today
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    // Format the date as "YYYY-MM-DD"
    const formattedThreshold = `${sevenDaysFromNow.getFullYear()}-${(
      sevenDaysFromNow.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${sevenDaysFromNow
      .getDate()
      .toString()
      .padStart(2, "0")}`;

    // Find documents with expiryDate within the next 7 days
    const query = {
      expiryDate: {
        $lte: formattedThreshold,
      },
      userId: user.id,
    };

    const cursor = await foodCollection.find(query);
    const documents = await cursor.toArray();

    // Iterate over the documents and log or process the matching items
    for (const doc of documents) {
      const formattedExpiryDate = await formatDateString(doc.expiryDate);
      console.log(
        `Document with _id ${doc._id}, ${doc.itemName} will expire on ${doc.expiryDate}`
      );

      console.log(
        `Alert: Expiration approaching for document with _id ${doc._id}. Expiration date: ${formattedExpiryDate}`
      );

      let userInfo = await getUserInfo(doc.userId);
      result.push(
        `ALERT: Hi ${userInfo.name}. Expiration approaching for your ${doc.itemName}`
      );
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    console.log("result: ", result);
    return result;
  }
}

async function formatDateString(dateString) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string");
    }

    // Format the date as "YYYY-MM-DD"
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return formattedDate;
  } catch (error) {
    console.error(`Error parsing date string: ${dateString}. ${error.message}`);
    return null;
  }
}

export { findExpirations };
