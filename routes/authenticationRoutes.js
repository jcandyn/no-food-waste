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
    //code here for GET
    res.render("authenticate");
  })
  .post(printMiddleware, async (req, res) => {
    let response;

    req.body.location = {
      streetAddress: req.body.streetAddress,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
    };
    const user = req.body;

    try {
      // Check if the confirm password and password are equal to each other
      if (req.body.password !== req.body.confirmPassword) {
        throw "Passwords do not match";
      }
    } catch (e) {
      return res.status(401).render("error", {error: e,});
    }
    try {
      // Check if the inputs are valid
      valid( req.body.email, req.body.password, req.body.firstName, req.body.lastName, req.body.dateOfBirth, req.body.location, req.body.phoneNumber );
    } catch (e) {
      return res.status(401).render("error", {error: e,});
    }

    // Try to input the user
    try {
      response = await registerUser( req.body.email, req.body.password, req.body.firstName, req.body.lastName, req.body.dateOfBirth, req.body.location, req.body.phoneNumber );
    } catch (e) {
      res.status(401).render("error", {
        error: e,
      });
    }

    if (response) {
      req.session.user = {
        id: response.id,
        email: user.email,
        password: user.password,
        name: user.firstName,
      };
      res.render("inventory", { name: user.firstName });
    }
    return;
  });

router
  .route("/login")
  .get(printMiddleware, loginMiddleware, async (req, res) => {
    //code here for GET
    res.render("authenticate");
  })
  .post(printMiddleware, async (req, res) => {
    //code here for POST
    const email = req.body["email"];
    const password = req.body["password"];

    let user;

    try {
      user = await loginUser(email.toLowerCase(), password);
    } catch (error) {
      res.status(401).render("error", {
        error: "Invalid Username and/or Password",
      });
      return;
    }
    if (user) {
      req.session.user = {
        id: user._id,
        email: user.email,
        password: user.password,
        name: user.name,
      };
      res.redirect("../");
    } else {
      res.status(401);
      res.render("error", {
        error: "Invalid Username and/or Password",
      });
    }
  });

router.route("/error").get(printMiddleware, async (req, res) => {
  //code here for GET
  const errorMessage = "An error occurred. Please try again."; // Customize the error message as needed

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
