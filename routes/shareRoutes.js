import express from "express";
const router = express.Router();
import shareData from "../data/share.js";
import help from "../validation.js";

let userId;
let foodList;
router
  .route("/")
  .get(async (req, res) => {
    if (!req.session.user) {
      return res.redirect("/");
    }
    try {
      // let state = req.body
      //userId = help.checkId(req.session.user.id, "User Id");
      //foodList = await shareData.addShareFood();

      res.render("sharing", {
        foodList: foodList,
        name: req.session.user.name,
        userId: req.session.user.id,
      });
    } catch (e) {
      return res.status(500).render("error", { error: e });
    }
    return;
  })

  .post(async (req, res) => {
    let foodInfo = req.body;
    if (!foodInfo || Object.keys(foodInfo).length === 0) {
      return res
        .status(400)
        .render("error", { error: "There are no fields in the request body" });
    }
    //Input checking
    try {
      let { state } = foodInfo;
      //userId = help.checkId(req.session.user.id, "User Id");
      foodList = await shareData.getShareFood(state);
      //console.log(foodList)
      res.render("sharing", {
        foodList: foodList,
        name: req.session.user.name,
        userId: req.session.user.id,
      });
    } catch (e) {
      return res.status(500).render("error", { error: e });
    }
    return;
  });
export default router;
