import { MongoClient } from "mongodb";
import { config } from "dotenv";
config();

const connectToDatabase = async () => {
  const url = `mongodb+srv://group_2_546:${process.env.DB_PASSWORD}@cluster0.dohb3e9.mongodb.net/?retryWrites=true&w=majority`;
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
export const shoppingCollection = await getCollection("Shopping");
