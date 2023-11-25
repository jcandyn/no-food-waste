import { Router } from "express";
const router = Router();
import { registerUser } from "../data/users.js";
import { loginUser } from "../data/users.js";
// import { passwordValidation } from "../helpers.js";

import {
  printMiddleware,
  loginMiddleware,
  registrationMiddleware,
  protectedMiddleware,
  adminMiddleware,
  logoutMiddleware,
} from "../middleware.js";

router.route("/").get(printMiddleware, async (req, res) => {
  //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
  return res.json({ error: "YOU SHOULD NOT BE HERE!" });
});

router
  .route("/register")
  .get(registrationMiddleware, printMiddleware, async (req, res) => {
    //code here for GET
    res.render("register");
  })
  .post(printMiddleware, async (req, res) => {
    //code here for POST
    // try {
    //   req.body.password = passwordValidation(req.body.password);
    // } catch (error) {
    //   res.status(400).render("register", {
    //     error: error,
    //   });
    // }

    const user = req.body;
    let response = await registerUser(
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      user.role
    );
    if (response) {
      res.render("login");
    }
    return;
  });

router
  .route("/login")
  .get(printMiddleware, loginMiddleware, async (req, res) => {
    //code here for GET
    res.render("login");
  })
  .post(printMiddleware, async (req, res) => {
    //code here for POST
    const emailAddress = req.body["email"];
    const password = req.body["password"];

    let user;

    try {
      user = await loginUser(emailAddress.toLowerCase(), password);
    } catch (error) {
      res.status(401).render("error", {
        error: "Invalid Username and/or Password",
      });
      return;
    }
    if (user) {
      req.session.user = {
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        password: user.password,
        role: user.role,
        secret: user.role === "admin" ? "Cats are the best!" : null,
      };
      res.redirect("/protected");
    } else {
      res.status(401);
      res.render("error", {
        error: "Invalid Username and/or Password",
      });
    }
  });

router
  .route("/protected")
  .get(protectedMiddleware, printMiddleware, async (req, res) => {
    //code here for GET
    if (!req.session.user) {
      return res.redirect("/login");
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
      return res.redirect("/login");
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
    res.render("logout");
  });

export default router;
