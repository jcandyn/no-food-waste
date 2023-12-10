import { foodCollection } from "./index.js";
import { getUserInfo } from "./users.js";

import { config } from "dotenv";
config();

async function findExpirations(user) {
  let expirations = [];
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

    const cursor = foodCollection.find(query);

    // Retrieve user info once outside the forEach loop
    const userInfo = await getUserInfo(user.id);

    for await (const doc of cursor) {
      console.log(
        `Document with _id ${doc._id}, ${doc.itemName} will expire on ${doc.expiryDate}`
      );

      expirations.push(
        "Alert: Expiration approaching for " +
          doc.itemName +
          ". Expiration date: " +
          doc.expiryDate
      );
      // Introduce a delay
      //   await delay(8000); // Delay for 8 seconds
    }
  } catch (error) {
    console.error("Error:", error);
  }
  return expirations;
}

// Function to introduce a delay
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { findExpirations };
