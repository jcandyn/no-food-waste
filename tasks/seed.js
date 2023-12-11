import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import users from "../data/users.js";
import foods from "../data/foods.js";
import shopping from "../data/shopping.js";

const db = await dbConnection();
await db.dropDatabase();

// Seed function for users
async function seedUsers() {
  const userData = {
    _id: "6562d5790a4f438a293d5845",
    dateJoined: new Date(),
    email: "test@gmail.com",
    password: "$2b$10$GQOwZWkY3DaWZwza3T.nL.Ny5bRbVhnrMfmFcX4.6vWsKglz669d6",
    name: "Joscandy",
    lastName: "Nunez",
    dateOfBirth: "1989-09-19",
    location: {
      streetAddress: "110 Colgate Ave",
      city: "Perth Amboy",
      state: "NC",
      zip: "08864",
    },
    phoneNumber: "+17327427021",
  };

  try {
    const newInsertInformation = await usersCollection.insertOne(userData);
    if (!newInsertInformation.insertedId) throw "User insert failed!";

    console.log("User seeded successfully");
  } catch (error) {
    console.error("Error seeding user:", error);
  }
}

// Seed function for foods
async function seedFoods() {
  const foodData = {
    userId: "6562d5790a4f438a293d5845",
    itemName: "Cookies",
    quantity: 2,
    unit: "gal",
    expiryDate: "11/30/2023",
    costPerItem: 1.5,
    totalCost: 3,
    brand: "BrandA",
    category: "produce",
    status: "fresh",
    imageUrl:
      "https://images.unsplash.com/photo-1626148107460-a7c46d716845?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzQxNzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MDEyMTk0NjB8&ixlib=rb-4.0.3&q=80&w=1080",
  };

  try {
    const insertInfo = await foodCollection.insertOne(foodData);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Could not add food item";

    console.log("Food seeded successfully");
  } catch (error) {
    console.error("Error seeding food:", error);
  }
}

// Seed function for foods
async function seedShoppingList() {
  const shoppingListData = {
    userId: "6562d5790a4f438a293d5845",
    items: ["eggs", "milk"],
  };

  try {
    const insertInfo = await shoppingCollection.insertOne(shoppingListData);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Could not add food item to shopping list";

    console.log("Shopping list seeded successfully");
  } catch (error) {
    console.error("Error seeding shopping list:", error);
  }
}

// Usage example
async function seedData() {
  await seedUsers();
  await seedFoods();
  await seedShoppingList();
  // Add more seed functions as needed
}

seedData(); // Call the seedData function to populate the data

console.log("Done seeding database");
await closeConnection();
