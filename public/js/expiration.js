import { foodCollection } from "../../data/index.js";

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
}

export { findExpirations };
