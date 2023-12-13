import { MongoClient } from "mongodb";
import { ServerApiVersion } from "mongodb";
import { config } from "dotenv";
config();

const uri = `mongodb+srv://group_2_546:${process.env.DB_PASSWORD}@cluster0.dohb3e9.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDatabase() {
  try {
    // Connect the client to the server
    await client.connect();
    // Return the connected database
    return client.db("zeroFoodWaste");
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
}

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("zeroFoodWaste").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

export { run, connectToDatabase };
