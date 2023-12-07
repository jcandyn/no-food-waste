import { foodCollection } from "../../data/index.js";
import { getUserInfo } from "../../data/users.js";

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

    // Iterate over the cursor and log or process the matching documents
    cursor.forEach(
      (doc) => {
        const formattedExpiryDate = formatDateString(doc.expiryDate);
        console.log(
          `Document with _id ${doc._id}, ${doc.itemName} will expire on ${doc.expiryDate}`
        );
        // You can perform additional processing or log the documents here
      },
      (err) => {
        if (err) {
          console.error("Error:", err);
        }
      }
    );
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

async function sendAlert(document, formattedThreshold) {
  console.log(
    `Alert: Expiration approaching for document with _id ${document._id}. Expiration date: ${formattedThreshold}`
  );
  // twilio alert logic goes here
  sendAlertViaTwilio(document);
}

async function sendAlertViaTwilio(document) {
  //   const client = twilio(accountSid, authToken);
  //   let userInfo = await getUserInfo(document.userId);
  //   let userPhone = userInfo.phoneNumber;
  //   console.log("userPhone: ", userPhone);
  //   client.messages
  //     .create({
  //       body: `ALERT: Hi ${userInfo.name}. Expiration approaching for your ${document.itemName}`,
  //       from: twilioPhoneNumber,
  //       to: userPhone,
  //     })
  //     .then((message) => console.log(`SMS alert sent: ${message.sid}`))
  //     .catch((error) =>
  //       console.error(`Error sending SMS alert: ${error.message}`)
  //     );
}

export { findExpirations };
