import { Router } from "express";
const router = Router();
import { registerUser } from "../data/users.js";
import { loginUser } from "../data/users.js";
// import { passwordValidation } from "../helpers.js";

import {
  printMiddleware,
  loginMiddleware,
  registrationMiddleware,
  adminMiddleware,
  logoutMiddleware,
} from "../middleware.js";

router.route("/").get(printMiddleware, async (req, res) => {
  //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
  return res.json({ error: "YOU SHOULD NOT BE HERE!" });
});

router
  .route("/signup")
  .get(registrationMiddleware, printMiddleware, async (req, res) => {
    console.log("hits this");
    //code here for GET
    res.render("authenticate");
  })
  .post(printMiddleware, async (req, res) => {
    console.log("hits this other one");
    //code here for POST
    // try {
    //   req.body.password = passwordValidation(req.body.password);
    // } catch (error) {
    //   res.status(400).render("register", {
    //     error: error,
    //   });
    // }
    let response;

    req.body.location = {
      streetAddress: req.body.streetAddress,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
    };
    const user = req.body;

    try {
      response = await registerUser(
        user.username,
        new Date(),
        user.email,
        user.password,
        user.firstName,
        user.lastName,
        user.dateOfBirth,
        user.location
      );
    } catch (error) {
      console.log("error: ", error);
      res.status(401).render("error", {
        error: "User could not be added",
      });
    }
    if (response) {
      res.render("inventory", { name: user.firstName });
    }
    return;
  });

router
  .route("/login")
  .get(printMiddleware, loginMiddleware, async (req, res) => {
    console.log("login gets hit");
    //code here for GET
    res.render("authenticate");
  })
  .post(printMiddleware, async (req, res) => {
    //code here for POST
    console.log("login hits the other one");
    const email = req.body["email"];
    const password = req.body["password"];

    let user;

    try {
      user = await loginUser(email.toLowerCase(), password);
    } catch (error) {
      console.log(error);
      res.status(401).render("error", {
        error: "Invalid Username and/or Password",
      });
      return;
    }
    if (user) {
      req.session.user = {
        email: user.email,
        password: user.password,
        name: user.name,
        // role: user.role,
        // secret: user.role === "admin" ? "Cats are the best!" : null,
      };
      res.redirect("/inventory");
    } else {
      res.status(401);
      res.render("error", {
        error: "Invalid Username and/or Password",
      });
    }
  });

router.route("/protected").get(printMiddleware, async (req, res) => {
  //code here for GET
  if (!req.session.user) {
    return res.redirect("/authenticate/login");
  }

  res.render("protected", {
    user: req.session.user,
  });
});

router
  .route("/admin")
  .get(adminMiddleware, printMiddleware, async (req, res) => {
    //code here for GET
    if (!req.session.user) {
      return res.redirect("/authenticate/login");
    } else if (req.session.user.role != "admin") {
      return res.redirect("/error");
    }

    res.render("admin", {
      user: req.session.user,
      secret: req.session.user.secret,
    });
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
