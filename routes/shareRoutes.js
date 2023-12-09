import express from "express";
const router = express.Router();
import shareData from "../data/share.js";
import help from "../validation.js";

let userId;
let foodList;
router
  .route("/")
  .get(async (req, res) => {
    try{
      userId = help.checkId(req.session.user.id, "User Id");
      foodList = await shareData.getShareFood(userId);
      //console.log(foodList)
      res.render("sharing", {
        foodList: foodList,
        name: req.session.user.name,
        userId:req.session.user.id
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
    let {inventoryId,itemName,expiryDate,linkedOrganization} = foodInfo;
    try {
      const foodItem = await shareData.addShareFood(
        userId,
        inventoryId,
        itemName,
        expiryDate,
        linkedOrganization
        
      );

      return res.status(200).redirect("/");
    } catch (e) {
      return res.status(500).render("error", { error: e });
    }

  })
export default router;