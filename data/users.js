//import mongo collections, bcrypt and implement the following data functions
import bcrypt from "bcrypt";
import { usersCollection } from "./index.js";
import { ObjectId } from "mongodb";

export function valid(
  email,
  password,
  firstName,
  lastName,
  dateOfBirth,
  phoneNumber
) {
  // Check if values are provided
  if (
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    !dateOfBirth ||
    !phoneNumber
  ) {
    throw "All fields need to have valid values";
  }

  // Check if type = string and there are no empty strings
  if (
    typeof email !== "string" ||
    email.trim() === "" ||
    typeof password !== "string" ||
    password.trim() === "" ||
    typeof firstName !== "string" ||
    firstName.trim() === "" ||
    typeof lastName !== "string" ||
    lastName.trim() === "" ||
    typeof phoneNumber !== "string" ||
    phoneNumber.trim() === ""
  ) {
    throw "Values provided are incorrect";
  }

  // Check if contactEmail is a valid email address format
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!validEmail.test(email.trim())) {
    throw "Email is invalid";
  }

  // Check if password is less than 8 characters
  if (password.length < 8) {
    throw "Password must have 8 characters";
  }

  //Check if the password is valid
  const validPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!validPassword.test(password)) {
    throw "Password must contain a capital letter, a lowercase letter, a number, and a special character";
  }

  //Check that the firstName and lastName are valid
  if (firstName.length < 2 || firstName.length > 25) {
    throw "First name cannot be shorter then 2 or longer than 25 characters";
  }

  if (lastName.length < 2 || lastName.lastName > 25) {
    throw "Last name cannot be shorter then 2 or longer than 25 characters";
  }

  if (/\s/.test(firstName) || /\d/.test(firstName)) {
    throw "First name cannot have empty spaces or numbers";
  }

  if (/\s/.test(lastName) || /\d/.test(lastName)) {
    throw "Last name cannot have empty spaces or numbers";
  }

  // To-Do: Date of Birth validation, check if the user is 18
  var selectedDate = new Date(dateOfBirth);

  if (isNaN(selectedDate.getTime())) {
    throw "Date of Birth is invalid";
  }

  var currentDate = new Date();
  var eighteenYearsAgo = new Date(
    currentDate.getFullYear() - 18,
    currentDate.getMonth(),
    currentDate.getDate()
  );

  if (selectedDate > eighteenYearsAgo) {
    throw "You must be 18 years or older";
  }

  // Check that phoneNumber is valid
  const validPhoneNumber = /^\d{10}$/;
  if (!validPhoneNumber.test(phoneNumber.trim())) {
    throw "Phone number is invalid, must be 10 numbers";
  }
}

export const registerUser = async (
  email,
  password,
  firstName,
  lastName,
  dateOfBirth,
  phoneNumber
) => {
  // Check if the values are valid running the valid method
  valid(email, password, firstName, lastName, dateOfBirth, phoneNumber);

  const usero = await usersCollection.findOne({ email: email.toLowerCase() });

  if (usero !== null) {
    throw "Email is already in use";
  }

  let hash = bcrypt.hashSync(password, 10);

  let newUser = {
    dateJoined: new Date().toUTCString(),
    email: email.toLowerCase(),
    password: hash,
    name: firstName,
    lastName: lastName,
    dateOfBirth: dateOfBirth,
    phoneNumber: phoneNumber,
  };

  const newInsertInformation = await usersCollection.insertOne(newUser);
  if (!newInsertInformation.insertedId) throw "Insert failed!";

  return { insertedUser: true, id: newInsertInformation.insertedId };
};

export const loginUser = async (email, password) => {
  let user;

  try {
    user = await usersCollection.findOne({ email: email.toLowerCase() });
  } catch (error) {
    throw error;
  }
  if (!user) throw "no user found associated with this email";

  if (!bcrypt.compareSync(password, user.password)) {
    // Passwords do not match
    user = null;
    throw "password is incorrect";
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
