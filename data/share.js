import { ObjectId } from "mongodb";
import { shareCollection } from "./index.js";
import help from "../validation.js";

const exportedMethods = {
    async addShareFood(userId,inventoryId,itemName,expiryDate,linkedOrganization){
        //Input Check

        let shareFood={
            userId:userId,
            inventoryId:inventoryId,
            itemName:itemName,
            expiryDate:expiryDate,
            linkedOrganization:linkedOrganization
        };
        const insertInfo = await shareCollection.insertOne(shareFood);
        if (!insertInfo.acknowledged || !insertInfo.insertedId)
            throw "Could not add food item to giveaway";

        const newId = insertInfo.insertedId.toString();
        const food = await shareCollection.findOne({ _id: new ObjectId(newId) });
        if (food === null) throw "No food to share with that id";
        food._id = food._id.toString();

        return food;

    },
    async getShareFood(state){
        //if (!ObjectId.isValid(userId)) throw "Invalid User ID";
       // userId = help.checkId(userId, "User Id");
       //Check state
       state = state.toLowerCase();
    
        let foodList = await shareCollection
          .find({ state: state })
          .toArray();
    
        if (!foodList) throw "Could not get all food for the user";
    
        foodList = foodList.map((element) => {
          element._id = element._id.toString();
          return element;
        });
        console.log(foodList)
    
        return foodList;
    }
    
};



export default exportedMethods;
