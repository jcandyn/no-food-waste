import { ObjectId } from "mongodb";
import { shareCollection } from "./index.js";
import help from "../validation.js";

const exportedMethods = {
    async addShareFood(){

    
           
            
        const docs = [
            
            // { state:"arkansas",name: "Northwest Arkansas Food Bank", address: "1378 June Self Drive Bethel Heights, AR 72764", number:"479.872.8774",site:"www.NWAfoodbank.org",email:"" },
            // { state:"arkansas",name: "St. Marys Food Bank", address: "2831 N. 31st Avenue Phoenix, AZ 85009", number:"602.242.3663",site:"www.firstfoodbank.org/",email:"" },
            // { state:"arkansas",name: "Community Food Bank of Southern Arizona", address: "3003 South Country Club Road Tucson, AZ 85713", number:"520.622.0525",site:"www.communityfoodbank.org/",email:"contactus@communityfoodbank.org" },
            // { state:"arkansas",name: "Yuma Community Food Bank", address: "2404 E 24th St. Ste. A Yuma, AZ 85365", number:"928.343.1243",site:"www.yumafoodbank.org",email:"info@yumafoodbank.org" },

            //{ state:"alabama",name: "Feeding the Valley Food Bank", address: "6744 Flat Rock Road Midland, GA 31820", number:"706.561.4755",site:"feedingthevalley.org/",email:"jshawa@feedingthevalley.org" },
            //{ state:"texas",name: "San Antonio Food Bank", address: "5200 Historic Old Hwy 90 San Antonio, TX 78227", number:"210.337.3663",site:"safoodbank.org/",email:"info@safoodbank.org" },
            
            
          
        ];
        
        //const insertInfo = await shareCollection.insertMany(docs);
        if (!insertInfo.acknowledged )
            throw "Could not add food item to giveaway";
        console.log(`${insertInfo.insertedCount} documents were inserted`);

        

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
        //console.log(foodList)
    
        return foodList;
    }
    
};



export default exportedMethods;
