import isLeapYear from 'leap-year';
import {ObjectId} from 'mongodb';
const exportedMethods = {
    checkId(id, varName='id') {
      if (!id) 
        throw `Error: You must provide an ${varName}`;
      if (typeof id !== 'string') throw `Error: ${varName} must be a string`;
      id = id.trim();
      if (id.length === 0)
        throw `Error: ${varName} cannot be an empty string or just spaces`;
      if (!ObjectId.isValid(id)) throw 'Error: invalid object ID';
      return id;
    },
  
    checkString(strVal, varName='string') {
      if (!strVal) 
        throw `Error: You must supply a ${varName}!`;
      if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
      strVal = strVal.trim();
      if (strVal.length === 0)
        throw `Error: ${varName} cannot be an empty string or string with just spaces`;
      if (!isNaN(strVal))
        throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
      return strVal;
    },

    checkNum(numVal, varName='Number'){
      if(!numVal) throw `Error: You must provide an ${varName} `;
      
      numVal=Number(numVal)
      if (typeof numVal !== 'number') throw `Error: ${varName} must be a number`;
      
      if (isNaN(numVal)) {
        throw `${varName || 'provided variable'} is NaN`;
      }
      return numVal;
    },

    checkUnit(unitVal, varName='Unit'){
      unitVal = this.checkString(unitVal,"Unit");
      unitVal=unitVal.toLowerCase();
      const unitStd=['tsp','tbsp','cup','pt','qt','gal','oz','floz','lb']
      if(!(unitStd.includes(unitVal))){
        throw `Provide only standard unit values`

      }
      return unitVal;
    },

    checkDate(dateVal, varName='Date'){
      if(!dateVal) throw`Error: You must provide an ${varName}`;
      dateVal =dateVal.trim()
      const dateCheck = new Date(dateVal )
      if(isNaN(dateCheck)){
        throw "Invalid  Date "
        
      }
      const dateStr = dateVal.split('-')
      // const mon = dateStr[0]
      // const date = dateStr[1]
      // const year = dateStr[2]
      const year=dateStr[0]
      const date=dateStr[2]
      const mon=dateStr[1]
      
      if(mon.length != 2 || date.length != 2 || year.length != 4){
        throw `Enter date: ${dateVal} in MM/DD/YYYY format.`
      }
    
      if(!(mon>= 1 && mon<=12))
        throw "Month value is not valid, enter value between 1-12"
      const day31 = ['01', '03', '05', '07', '08', '10', '12']
      const day30 =['04', '06', '09', '11']
      if(day31.includes(mon)) {
        if(!(date>=1 && date<=31)){
          throw "Invalid date ";
        }
      }
      if(day30.includes(mon)) {
        if(!(date>=1 && date<=30)){
          throw "Invalid input, day should be between 1-30 ";
        }
      }
      if(mon == '02'){
        if(isLeapYear(year)){
          if(!(date>=1 && date<=29)){
            throw "Leap year feb should have date in between 1-29";
          }
        }
        else{
          if (!(date>=1 && date<=28)){
            throw "Feb should have date in between 1-28";
          }
        }
        
      }
      const currentDate = new Date()
      if(dateCheck < currentDate){
        throw "Expiry date should be greater than current date."
      }
      return dateVal;
    }
*/
}

export default exportedMethods;