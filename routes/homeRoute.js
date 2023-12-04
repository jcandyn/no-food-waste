import express from "express";
const router = express.Router();

router.route("/recipes").get(async (req, res) => {
  //code here for GET will render the inventory handlebars file
  if (req.session.user) {
    res.render("recipes", { name: req.session.user.name });
  } else {
    res.redirect("../");
  }
});

router.route("/").get(async (req, res) => {
  // Only redirect to '/food' if the user is on the home page ('/')
  if (req.session.user && req.originalUrl === '/') {
    res.redirect("/food");
  } else {
    res.render("home", {});
  }
});


router.route("/about").get(async (req, res) => {
  //code here for GET will render the about handlebars file
  if (req.session.user) {
    res.render("about", { name: req.session.user.name });
  } else {
    res.render("about", {});
  }
});

router.route("/food").get(async (req, res) => {
  //code here for GET will render the inventory handlebars file
  if (req.session.user) {
    res.render("inventory", { name: req.session.user.name });
  } else {
    res.redirect("../");
  }
});


router.route("/analytics").get(async (req, res) => {
  //code here for GET will render the inventory handlebars file
  if (req.session.user) {
    res.render("analytics", { name: req.session.user.name });
  } else {
    res.redirect("../");
  }
});

router.route("/composting").get(async (req, res) => {
  //code here for GET will render the inventory handlebars file
  if (req.session.user) {
    res.render("composting", { name: req.session.user.name });
  } else {
    res.redirect("../");
  }
});

router.route("/sharing").get(async (req, res) => {
  //code here for GET will render the inventory handlebars file
  if (req.session.user) {
    res.render("sharing", { name: req.session.user.name });
  } else {
    res.redirect("../");
  }
});

router.route("/storage").get(async (req, res) => {
  //code here for GET will render the inventory handlebars file
  if (req.session.user) {
    res.render("storage", { name: req.session.user.name });
  } else {
    res.redirect("../");
  }
});

export default router;
