import { foodCollection } from "../../data/index.js";
import { getUserInfo } from "../../data/users.js";

import { config } from "dotenv";
config();

import twilio from "twilio";

// twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_Sid;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = "+18886918536";

async function findExpirations() {
  // expiration threshold of 7 days
  const expirationThreshold = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const formattedThreshold = expirationThreshold.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  const date = new Date().toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  // Find documents with approaching expiration
  const query = {
    expiryDate: {
      $gte: date,
      $lte: formattedThreshold,
    },
  };

  const cursor = foodCollection.find(query);

  // Iterate over the cursor and send alerts
  cursor.forEach(
    (doc) => {
      console.log(doc);
      const formattedThreshold = formatDateString(doc.expiryDate);
      if (formattedThreshold) {
        sendAlert(doc, formattedThreshold);
      }
    },
    (err) => {
      console.log("Error: ", err);
      client.close();
    }
  );
}

async function formatDateString(dateString) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string");
    }

    // Format the date as "mm/dd/yyyy"
    const formattedDate = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;
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
  const client = twilio(accountSid, authToken);

  let userInfo = await getUserInfo(document.userId);
  let userPhone = userInfo.phoneNumber;
  console.log("userPhone: ", userPhone);

  client.messages
    .create({
      body: `ALERT: Hi ${userInfo.name}. Expiration approaching for your ${document.itemName}`,
      from: twilioPhoneNumber,
      to: userPhone,
    })
    .then((message) => console.log(`SMS alert sent: ${message.sid}`))
    .catch((error) =>
      console.error(`Error sending SMS alert: ${error.message}`)
    );
}

export { findExpirations };
