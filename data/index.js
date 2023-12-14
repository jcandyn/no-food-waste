import { MongoClient } from "mongodb";
import { config } from "dotenv";
config();

export const connectToDatabase = async () => {
  const url = process.env.DB_URI;
  const client = new MongoClient(url);

  const dbName = "zeroFoodWaste";

  try {
    await client.connect();
    const db = client.db(dbName);
    return db;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw new Error("Unable to connect to the database");
  }
};

const getCollection = async (collectionName) => {
  const db = await connectToDatabase();
  return db.collection(collectionName);
};

export const usersCollection = await getCollection("Users");
export const foodCollection = await getCollection("Inventory");
export const giveawayCollection = await getCollection("Giveaway");
export const shoppingCollection = await getCollection("Shopping");
