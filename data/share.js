import { ObjectId } from "mongodb";
import { shareCollection } from "./index.js";
import help from "../validation.js";

const exportedMethods = {
    async addShareFood(){

    
           
            
        const docs = [
            
            // { state:"arkansas",name: "Northwest Arkansas Food Bank", address: "1378 June Self Drive Bethel Heights, AR 72764", number:"479.872.8774",site:"www.NWAfoodbank.org",email:"" },
            // { state:"arkansas",name: "River Valley Regional Food Bank", address: "1617 South Zero Street PO Box 180070 Ft. Smith, AR 72918", number:"479.785.0582",site:"www.rvrfoodbank.org/",email:"" },
            // { state:"arkansas",name: "Food Bank of Northeast Arkansas", address: "3414 One Place P.O. Box 2097 Jonesboro, AR 72402", number:"870.932.3663",site:"www.foodbankofnea.org",email:"contactus@communityfoodbank.org" },
            // { state:"arkansas",name: "Arkansas Foodbank", address: "4301 W 65th St Little Rock, AR 72209", number:"859.255.6592",site:"arkansasfoodbank.org/",email:"" },

            // { state:"california",name: "Central California Food Bank", address: "4010 E. Amendola Ave. Fresno, CA 93725", number:"559.237.2527",site:"ccfoodbank.org/",email:"info@ccfoodbank.org" },
            // { state:"california",name: "FIND Food Bank", address: "83-775 Citrus Ave P.O. Box 10080 Indio, CA 92202", number:"760.775.3663",site:"www.FINDfoodbank.org",email:"info@findfoodbank.org" },
            // { state:"california",name: "Second Harvest Food Bank of Orange County", address: "8014 Marine Way Irvine, CA 92618", number:"949.653.2900",site:"www.feedoc.org/",email:"info@feedoc.org" },
            // { state:"california",name: "Los Angeles Regional Food Bank", address: "1734 E. 41st Street Los Angeles, CA 90058", number:"323.234.3030",site:"www.lafoodbank.org",email:"jkindle@lafoodbank.org" },

            // { state:"colorado",name: "Care and Share Food Bank", address: "2605 Preamble Point Colorado Springs, CO 80915", number:"719.528.1247",site:"careandshare.org/",email:"info@careandshare.org" },
            // { state:"colorado",name: "Food Bank of the Rockies", address: "10700 E. 45th Ave Denver, CO 80239", number:"303.371.9250",site:"www.foodbankrockies.org",email:"donatenow@foodbankrockies.org" },
            // { state:"colorado",name: "Weld Food Bank", address: "1108 H Street Greeley, CO 80631", number:"970.356.2199",site:"www.weldfoodbank.org",email:"info@weldfood.org" },
            // { state:"colorado",name: "Community Food Share", address: "650 S. Taylor Ave. Louisville, CO 80027", number:"303.652.3663",site:"communityfoodshare.org/ ",email:"info@communityfoodshare.org" },

            // { state:"connecticut",name: "Connecticut Foodshare", address: "2 Research Parkway Wallingford, CT 06492", number:"203.469.5000",site:"www.ctfoodshare.org/",email:"contact-us@ctfoodshare.org" },
            // { state:"delaware",name: "Food Bank of Delaware", address: "222 Lake Drive Newark, DE 19702", number:"302.292.1305",site:"www.fbd.org",email:"info@communityfoodshare.org" },

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
