import express from "express";
const router = express.Router();

router.route("/").get(async (req, res) => {
  //code here for GET will render the home handlebars file
  res.render("home", {});
});

router.route("/about").get(async (req, res) => {
  //code here for GET will render the about handlebars file
  res.render("about", {});
});

router.route("/inventory").get(async (req, res) => {
  //code here for GET will render the inventory handlebars file
  res.render("inventory", {});
});

router.route("/analytics").get(async (req, res) => {
  //code here for GET will render the inventory handlebars file
  res.render("analytics", {});
});

router.route("/composting").get(async (req, res) => {
  //code here for GET will render the inventory handlebars file
  res.render("composting", {});
});

router.route("/sharing").get(async (req, res) => {
  //code here for GET will render the inventory handlebars file
  res.render("sharing", {});
});

router.route("/storage").get(async (req, res) => {
  //code here for GET will render the inventory handlebars file
  res.render("storage", {});
});

export default router;
