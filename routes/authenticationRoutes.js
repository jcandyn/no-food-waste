import { Router } from "express";
const router = Router();
import { registerUser, loginUser, valid } from "../data/users.js";
// import { passwordValidation } from "../helpers.js";
import xss from "xss";
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
  .post(registrationMiddleware, printMiddleware, async (req, res) => {
    try {
      // Check if the inputs are valid
      // Check if the password and confirm password match
      if (req.body.password !== req.body.confirmPassword) {
        throw "Password and confirm password do not match";
      }

      await valid(
        req.body.email,
        req.body.password,
        req.body.firstName,
        req.body.lastName,
        req.body.dateOfBirth,
        req.body.phoneNumber
      );


    let emailVal = xss(req.body.email)
    let passwordVal = xss(req.body.password)
    let firstNameVal = xss(req.body.firstName)
    let lastNameVal = xss(req.body.lastName)
    let dateOfBirthVal =xss(req.body.dateOfBirth)
    let phoneNumberVal = xss(req.body.phoneNumber)


      // Try to input the user
      let response = await registerUser(
        emailVal,
        passwordVal, 
        firstNameVal,
        lastNameVal, 
        dateOfBirthVal,
        phoneNumberVal
      );

      // If registration is successful, update the session and redirect
      req.session.user = {
        id: response.id,
        email: req.body.email,
        password: req.body.password,
        name: req.body.firstName,
      };
      
      return res.status(200).send("User logged in successfully");
    } catch (error) {
      console.log("Routes error: ", error);
      return res.status(401).send({ error: error });
    }
  });

router
  .route("/login")
  .get(printMiddleware, loginMiddleware, (req, res) => {
    // Render the login view
    res.render("authenticate");
  })
  .post(printMiddleware, async (req, res) => {

    //code here for POST
    let email = req.body["email"].toLowerCase();
    let password = req.body["password"];
    email=xss(email)
    password=xss(password)


    try {
      // Attempt to log in the user
      const user = await loginUser(email, password);

      // If login is successful, update the session and redirect
      req.session.user = {
        id: user._id,
        email: user.email,
        password: user.password,
        name: user.name,
      };
      
      return res.status(200).send("User registered successfully");
    } catch (error) {
      console.log("Routes error: ", error);
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
