//import mongo collections, bcrypt and implement the following data functions
import bcrypt from "bcrypt";
// import { users } from "../config/mongoCollections.js";
import { MongoClient } from "mongodb";
const url =
  "mongodb+srv://group_2_546:pass01a@cluster0.dohb3e9.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);

const dbName = "zeroFoodWaste";
let usersCollection;

try {
  await client.connect();
  const db = client.db(dbName);
  // Reference the "people" collection in the specified database
  usersCollection = db.collection("Users");
} catch (error) {
  console.log("Error connecting to db: ", error);
}

export const registerUser = async (
  username,
  dateJoined,
  email,
  password,
  firstName,
  lastName,
  dateOfBirth,
  location
) => {
  let hash = bcrypt.hashSync(password, 10);

  let newUser = {
    username: username,
    dateJoined: dateJoined,
    email: email.toLowerCase(),
    password: hash,
    name: firstName,
    lastName: lastName,
    dateOfBirth: dateOfBirth,
    location: location,
  };
  const usersCollection = await users();
  const newInsertInformation = await usersCollection.insertOne(newUser);
  if (!newInsertInformation.insertedId) throw "Error: Insert failed!";

  return { insertedUser: true };
};

export const loginUser = async (emailAddress, password) => {
  let user;

  const userCollection = await users();

  try {
    user = await userCollection.findOne({ email: emailAddress });
  } catch (error) {
    throw error;
  }
  if (!user) throw "Error: User not found";

  if (!bcrypt.compareSync(password, user.password)) {
    // Passwords do not match
    user = null;
  }
  return user;
};
