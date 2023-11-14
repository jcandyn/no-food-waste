// import userData from "./users.js";
import { ObjectId, MongoClient } from "mongodb";
// import validation from "./validation.js";

const url =
  "mongodb+srv://group_2_546:pass01a@cluster0.dohb3e9.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);

const dbName = "zeroFoodWaste";

const exportedMethods = {
  async addFood(name, quantity, unit, date, cost, totalCost, brand) {
    async function run() {
      try {
        // Connect to the Atlas cluster
        await client.connect();
        const db = client.db(dbName);
        // Reference the "people" collection in the specified database
        const col = db.collection("Inventory");
        // Create a new document
        let newFoodItem = {
          userId: new ObjectId(), // this should come from somewhere else
          itemName: name,
          quantity: quantity,
          unit: unit,
          expiryDate: date,
          constPerItem: cost,
          totalCost: totalCost,
          brand: brand,
        };
        // Insert the document into the specified collection
        const p = await col.insertOne(newFoodItem);
        // Find and return the document
        const filter = { itemName: "Milk" };
        const document = await col.findOne(filter);
        console.log("Document found:\n" + JSON.stringify(document));
      } catch (err) {
        console.log(err.stack);
      } finally {
        await client.close();
      }
    }
    run().catch(console.dir);
  },
  // add data function to update

  // add data function to delete by id
};
export default exportedMethods;
