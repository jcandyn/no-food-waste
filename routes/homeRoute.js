import express from "express";
const router = express.Router();

router.route("/").get(async (req, res) => {
  //code here for GET will render the home handlebars file

  if (req.session.user) {
    console.log("req ", req.session);
    res.render("home", { name: req.session.user.name });
  } else {
    res.render("home", {});
  }
});

router.route("/about").get(async (req, res) => {
  //code here for GET will render the about handlebars file
  if (req.session.user) {
    console.log("req ", req.session);
    res.render("about", { name: req.session.user.name });
  } else {
    res.render("about", {});
  }
});

router.route("/inventory").get(async (req, res) => {
  //code here for GET will render the inventory handlebars file
  if (req.session.user) {
    console.log("req ", req.session);
    res.render("inventory", { name: req.session.user.name });
  } else {
    res.redirect("../");
  }
});

router.route("/analytics").get(async (req, res) => {
  //code here for GET will render the inventory handlebars file
  if (req.session.user) {
    console.log("req ", req.session);
    res.render("analytics", { name: req.session.user.name });
  } else {
    res.redirect("../");
  }
});

router.route("/composting").get(async (req, res) => {
  //code here for GET will render the inventory handlebars file
  if (req.session.user) {
    console.log("req ", req.session);
    res.render("composting", { name: req.session.user.name });
  } else {
    res.redirect("../");
  }
});

router.route("/sharing").get(async (req, res) => {
  //code here for GET will render the inventory handlebars file
  if (req.session.user) {
    console.log("req ", req.session);
    res.render("sharing", { name: req.session.user.name });
  } else {
    res.redirect("../");
  }
});

router.route("/storage").get(async (req, res) => {
  //code here for GET will render the inventory handlebars file
  if (req.session.user) {
    console.log("req ", req.session);
    res.render("storage", { name: req.session.user.name });
  } else {
    res.redirect("../");
  }
});

export default router;
