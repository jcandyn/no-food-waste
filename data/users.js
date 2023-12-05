//import mongo collections, bcrypt and implement the following data functions
import bcrypt from "bcrypt";
import { usersCollection } from "./index.js";
import { ObjectId } from "mongodb";

export const registerUser = async (
  username,
  dateJoined,
  email,
  password,
  firstName,
  lastName,
  dateOfBirth,
  location,
  phoneNumber
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
    phoneNumber: phoneNumber,
  };

  const newInsertInformation = await usersCollection.insertOne(newUser);
  if (!newInsertInformation.insertedId) throw "Error: Insert failed!";

  return { insertedUser: true, id: newInsertInformation.insertedId };
};

export const loginUser = async (email, password) => {
  let user;

  try {
    user = await usersCollection.findOne({ email: email });
  } catch (error) {
    throw error;
  }
  if (!user) throw "Error: User not found";

  if (!bcrypt.compareSync(password, user.password)) {
    // Passwords do not match
    user = null;
    throw "Error: Incorrect password";
  }
  return user;
};

export const getUserInfo = async (userId) => {
  try {
    if (!ObjectId.isValid(userId)) {
      throw "Error: Invalid user ID";
    }

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      throw "Error: User not found";
    }

    const userInfo = {
      phoneNumber: user.phoneNumber,
      name: user.name,
    };

    return userInfo;
  } catch (error) {
    throw error;
  }
};
