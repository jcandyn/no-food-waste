import { foodCollection } from "../../data/index.js";
import { getUserInfo } from "../../data/users.js";
import wss from "../../websocket.js";
import WebSocket from "ws";

import { config } from "dotenv";
config();

async function findExpirations(user) {
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
      const formattedExpiryDate = formatDateString(doc.expiryDate);
      console.log(
        `Document with _id ${doc._id}, ${doc.itemName} will expire on ${doc.expiryDate}`
      );
      await sendAlert(doc, userInfo);
      // Introduce a delay
      await delay(8000); // Delay for 8 seconds
    }
  } catch (error) {
    console.error("Error:", error);
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

async function sendAlert(document, userInfo) {
  console.log(
    `Alert: Expiration approaching for document with _id ${document._id}. Expiration date: ${document.expiryDate}`
  );

  await sendAlertViaSocket(document, userInfo);
}

async function sendAlertViaSocket(document, userInfo) {
  wss.clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      const notification = JSON.stringify({
        type: "notification",
        message: `ALERT: Expiration approaching for your ${document.itemName}`,
      });
      ws.send(notification);
    }
  });
}

// Function to introduce a delay
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { findExpirations };
