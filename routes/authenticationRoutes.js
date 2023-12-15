import { Router } from "express";
const router = Router();
import { registerUser, loginUser, valid } from "../data/users.js";
// import { passwordValidation } from "../helpers.js";

import {
  printMiddleware,
  loginMiddleware,
  registrationMiddleware,
  logoutMiddleware,
} from "../middleware.js";

router.route("/").get(printMiddleware, async (req, res) => {
  //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
  return res.json({ error: "YOU SHOULD NOT BE HERE!" });
});

router
  .route("/signup")
  .get(registrationMiddleware, printMiddleware, async (req, res) => {
    // Code here for GET
    res.render("authenticate");
  })
  .post(printMiddleware, async (req, res) => {
    try {
      let response;

      const user = req.body;

      // Check if the confirm password and password are equal to each other
      if (req.body.password !== req.body.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Check if the inputs are valid
      valid(
        req.body.email,
        req.body.password,
        req.body.firstName,
        req.body.lastName,
        req.body.dateOfBirth,
        req.body.phoneNumber
      );

      // Try to input the user
      response = await registerUser(
        req.body.email,
        req.body.password,
        req.body.firstName,
        req.body.lastName,
        req.body.dateOfBirth,
        req.body.phoneNumber
      );

      if (response) {
        req.session.user = {
          id: response.id,
          email: user.email,
          password: user.password,
          name: user.firstName,
        };
      }

      return res.status(200).send("User registered successfully");
    } catch (error) {
      // Log the error for debugging purposes
      console.error(error);

      // Render the authenticate view with the error message
      return res.status(400).send({ error: error.message });
    }
  });

router
  .route("/login")
  .get(printMiddleware, loginMiddleware, async (req, res) => {
    res.render("authenticate");
  })
  .post(printMiddleware, async (req, res) => {
    const email = req.body["email"];
    const password = req.body["password"];

    let user;

    try {
      user = await loginUser(email.toLowerCase(), password);
    } catch (error) {
      return res.status(401).send({ error: error });
    }

    if (user) {
      req.session.user = {
        id: user._id,
        email: user.email,
        password: user.password,
        name: user.name,
      };
      return res.redirect("../");
    } else {
      return res.status(401).send({ error: error });
    }
  });

router.route("/error").get(printMiddleware, async (req, res) => {
  //code here for GET
  const errorMessage = "An error occurred. Please try again.";

  res.status(500).render("error", {
    error: errorMessage,
  });
});

router
  .route("/logout")
  .get(logoutMiddleware, printMiddleware, async (req, res) => {
    //code here for GET
    req.session.destroy();
    res.redirect("../");
  });

export default router;
