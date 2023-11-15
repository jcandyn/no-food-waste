import express from "express";
const router = express.Router();
import foodData from "../data/foods.js";

// Create a new food item
router
  .route("/")
  .get(async (req, res) => {
      
      try {
        let foodList = await foodData.getAllFood();
        return res.json(foodList);
      } catch (e) {
        return res.status(500).json({error: e});
      }
  })
  .post(async (req, res) => {
    let foodInfo = req.body;
    if (!foodInfo || Object.keys(foodInfo).length === 0) {
      return res.status(400).json({error: 'There are no fields in the request body'});
    }
    // try{
    //   //For checking the input, will do later
    // }catch(e){
    //   return res.status(400).json({error: e});
    // }
    let {itemName,quantity,unit,expiryDate,costPerItem,totalCost,brand,category,status} = foodInfo;
    try{
      const foodItem = await foodData.addFood(itemName,quantity,unit,expiryDate,costPerItem,totalCost,brand,category,status);
      //console.log(foodItem)
      return res.status(200).send("Food item added sucessfully")
    }catch(e){
      return res.status(500).json({ error: e });
    }

  });


router
.route('/:Id')
.get(async (req, res) => {
  //Input check wil do later
  // try {
  //   
  // } catch (e) {
  //   return res.status(400).json({error: e});
  // }
  try {
    let food = await foodData.getFoodById(req.params.Id);
    return res.json(food);
  } catch (e) {
    return res.status(404).json({error: e});
  }
})
.delete(async (req, res) => {
  //Input checking
  // try {
  //   req.params.Id = help.checkId(req.params.Id,'Food ID');
  // } catch (e) {
  //   return res.status(400).json({error: e});
  // }
  try{
    await foodData.getFoodById(req.params.Id);
  }catch(e){
    return res.status(404).json({error: e});
  }
  try{
    const deleteFood = await foodData.removeFood(req.params.Id)
    return res.json(deleteFood)
  }catch(e){
    return res.status(500).json({error: e});
  }
})
.put(async (req, res) => {
  //code here for PUT
  let updateData = req.body;
  if (!updateData || Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({error: 'There are no fields in the request body'});
  }
  // try {
  //   //food Id check
  // } catch (e) {
  //   return res.status(400).json({error: e});
  // }
  try{
    await foodData.getFoodById(req.params.Id);
  }catch(e){
    return res.status(404).json({error: e});
  }
  // try {
  //   //Input checking
  // } catch (e) {
  //   return res.status(400).json({error: e});
  // }
  let {userId,itemName,quantity,unit,expiryDate,costPerItem,totalCost,brand,category,status} = updateData;
  
  try {
    const updateFood = await foodData.updateFood(req.params.Id,userId,itemName,quantity,unit,expiryDate,costPerItem,totalCost,brand,category,status);
    return res.json(updateFood);
  } catch (e) {
    return res.status(500).json({error: e});
  }    

});


export default router;
