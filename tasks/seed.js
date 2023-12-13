import {
  run as mongoConnectRun,
  connectToDatabase,
} from "../config/mongoConnect.js";
import {
  usersCollection,
  foodCollection,
  shoppingCollection,
  giveawayCollection,
} from "../data/index.js";

async function connectAndDropDatabase() {
  try {
    // Use the run function from mongoConnect.js
    // await mongoConnectRun();

    // Dropping the database after connecting
    const db = await connectToDatabase();
    await db.dropDatabase();
    console.log("Database dropped successfully");
  } catch (error) {
    console.error("Error dropping database:", error);
  }
}

// Seed function for users
async function seedUsers() {
  const userData = {
    dateJoined: new Date().toUTCString(),
    email: "email@gmail.com",
    password: "$2b$10$Yg.jhi9OWOuyXlBteKTFVuLcHEhh7JyBm1.m6C..e6ESinrS.lvbK",
    name: "Beyonce",
    lastName: "Knowles",
    dateOfBirth: "1989-09-19",
    location: {
      streetAddress: "110 Colgate Ave",
      city: "Perth Amboy",
      state: "NC",
      zip: "08864",
    },
    phoneNumber: "+17347425024",
  };

  try {
    const newInsertInformation = await usersCollection.insertOne(userData);
    if (!newInsertInformation.insertedId) throw "User insert failed!";

    console.log("User seeded successfully");

    // Return the inserted _id to be used as userId in other seed functions
    return newInsertInformation.insertedId;
  } catch (error) {
    console.error("Error seeding user:", error);
  }
}

// Seed function for foods
async function seedFoods(userId) {
  const foodData = {
    userId: userId.toString(), // Use the userId captured from seedUsers
    itemName: "soda",
    quantity: 1,
    unit: "gal",
    expiryDate: "2023-12-30",
    costPerItem: 5.6,
    totalCost: 5.6,
    brand: "Shoprite",
    category: "Beverage",
    status: "Fresh",
    imageUrl:
      "https://images.unsplash.com/photo-1581098365948-6a5a912b7a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzQxNzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MDI0MzE1ODJ8&ixlib=rb-4.0.3&q=80&w=1080",
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

// Seed function for shopping list
async function seedShoppingList(userId) {
  const shoppingListData = {
    userId: userId.toString(), // Use the userId captured from seedUsers
    items: ["2 oranges", "2 dates", "1 milk"],
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

// Seed function for giveaway
async function seedGiveaway() {
  const giveawayInfo = [
    {
      state: "texas",
      name: "Central Texas Food Bank",
      address: "6500 Metropolis Drive Austin, TX 78744",
      number: "512.282.2111",
      site: "www.centraltexasfoodbank.org/",
      email: "reports@lighthouse-services.com",
    },
    {
      state: "texas",
      name: "San Antonio Food Bank",
      address: "5200 Historic Old Hwy 90 San Antonio, TX 78227",
      number: "210.337.3663",
      site: "safoodbank.org/",
      email: "info@safoodbank.org",
    },
    {
      state: "texas",
      name: "High Plains Food Bank",
      address: "815 S. Ross PO Box 31803 Amarillo, TX 79120",
      number: "806.374.8562",
      site: "www.hpfb.org/",
      email: "info@hpfb.org",
    },
    {
      state: "alabama",
      name: "Feeding the Valley Food Bank",
      address: "6744 Flat Rock Road Midland, GA 31820",
      number: "706.561.4755",
      site: "feedingthevalley.org/",
      email: "jshawa@feedingthevalley.org",
    },
    {
      state: "alabama",
      name: "Community Food Bank of Central Alabama",
      address: "107 Walter Davis Drive Birmingham, AL 35209",
      number: "205.942.8911",
      site: "www.feedingal.org/",
      email: "feedingal@feeding.org",
    },
    {
      state: "alabama",
      name: "Heart of Alabama Food Bank",
      address: "521 Trade Center Street Montgomery, AL 36108",
      number: "334.263.3784",
      site: "hafb.org/",
      email: "info@setxfoodbank.org",
    },
    {
      state: "alabama",
      name: "Feeding the Gulf Coast",
      address: "5248 Mobile South Street Theodore, AL 36582",
      number: "251.653.1617",
      site: "www.feedingthegulfcoast.org",
      email: "Coastalbendfb@coastalbendfoodbank.org",
    },
    {
      state: "colorado",
      name: "Care and Share Food Bank",
      address: "2605 Preamble Point Colorado Springs, CO 80915",
      number: "719.528.1247",
      site: "careandshare.org/",
      email: "info@careandshare.org",
    },
    {
      state: "colorado",
      name: "Food Bank of the Rockies",
      address: "10700 E. 45th Ave Denver, CO 80239",
      number: "303.371.9250",
      site: "www.foodbankrockies.org",
      email: "donatenow@foodbankrockies.org",
    },
    {
      state: "arizona",
      name: "Community Food Bank of Southern Arizona",
      address: "3003 South Country Club Road Tucson, AZ 85713",
      number: "520.622.0525",
      site: "www.communityfoodbank.org/",
      email: "contactus@communityfoodbank.org",
    },
    {
      state: "arizona",
      name: "Yuma Community Food Bank",
      address: "2404 E 24th St. Ste. A Yuma, AZ 85365",
      number: "928.343.1243",
      site: "www.yumafoodbank.org",
      email: "info@yumafoodbank.org",
    },
    {
      state: "arizona",
      name: "St. Marys Food Bank",
      address: "2831 N. 31st Avenue Phoenix, AZ 85009",
      number: "602.242.3663",
      site: "www.firstfoodbank.org/",
      email: "",
    },
    {
      state: "arizona",
      name: "United Food Bank",
      address: "245 South Nina Drive Mesa, AZ 85210",
      number: "480.926.4897",
      site: "www.unitedfoodbank.org/",
      email: "info@unitedfoodbank.org",
    },
    {
      state: "california",
      name: "FIND Food Bank",
      address: "83-775 Citrus Ave P.O. Box 10080 Indio, CA 92202",
      number: "760.775.3663",
      site: "www.FINDfoodbank.org",
      email: "info@findfoodbank.org",
    },
    {
      state: "california",
      name: "Central California Food Bank",
      address: "4010 E. Amendola Ave. Fresno, CA 93725",
      number: "559.237.2527",
      site: "ccfoodbank.org/",
      email: "info@ccfoodbank.org",
    },
    {
      state: "california",
      name: "Los Angeles Regional Food Bank",
      address: "1734 E. 41st Street Los Angeles, CA 90058",
      number: "323.234.3030",
      site: "www.lafoodbank.org",
      email: "jkindle@lafoodbank.org",
    },
    {
      state: "california",
      name: "Second Harvest Food Bank of Orange County",
      address: "8014 Marine Way Irvine, CA 92618",
      number: "949.653.2900",
      site: "www.feedoc.org/",
      email: "info@feedoc.org",
    },
    {
      state: "connecticut",
      name: "Connecticut Foodshare",
      address: "2 Research Parkway Wallingford, CT 06492",
      number: "203.469.5000",
      site: "www.ctfoodshare.org/",
      email: "contact-us@ctfoodshare.org",
    },
    {
      state: "arkansas",
      name: "Arkansas Foodbank",
      address: "4301 W 65th St Little Rock, AR 72209",
      number: "859.255.6592",
      site: "arkansasfoodbank.org/",
      email: "",
    },
    {
      state: "delaware",
      name: "Food Bank of Delaware",
      address: "222 Lake Drive Newark, DE 19702",
      number: "302.292.1305",
      site: "www.fbd.org",
      email: "info@communityfoodshare.org",
    },
  ];

  try {
    const insertInfo = await giveawayCollection.insertMany(giveawayInfo);
    // if (
    //   !insertInfo.acknowledged ||
    //   !insertInfo.insertedIds ||
    //   !insertInfo.insertedIds.length
    // )
    //   throw "Could not add items to the list";

    console.log("Giveaway seeded successfully");
  } catch (error) {
    console.error("Error seeding giveaway :", error);
  }
}

// Usage example
async function seedData() {
  const userId = await seedUsers();
  if (userId) {
    await seedFoods(userId);
    await seedShoppingList(userId);
    await seedGiveaway();
    // Add more seed functions as needed
  }
}

// Main function
async function main() {
  await connectAndDropDatabase();
  await seedData();
  console.log("Done seeding database");
}

main();
