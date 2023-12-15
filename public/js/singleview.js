$(document).ready(function(){

    const editBtn =$('#editBtn');
    const editForm=$('#editFood-form');
    const editDiv=$('#editDiv');
    //const errorDisplay=$('#errorDisplay');
    const errorClass=$('.error-list')
    //const deleteBtn=$('#deleteBtn')
    const closeButton=$('#closeBtn')
    editForm.hide();
    editDiv.hide();
    

    editBtn.click(function () {
        
        errorClass.empty();
        editForm.show();
        editDiv.show();
        editBtn.hide();
        
    });

    closeButton.click(function(){
      editForm.hide();
      editDiv.hide();
      editBtn.show();
    })
    function formatCurrency(value) {
      return "$" + parseFloat(value).toFixed(2);
    }
  
    // Function to calculate and update total cost
    
  
    function updateTotalCost() {
      let qty = parseFloat($('#quantity').val()) || 0; // Default to 0 if not a number
      let costItem = parseFloat($('#costPerItem').val().replace('$', '')) || 0; // Default to 0 if not a number
      console.log("Quantity:", qty, "Cost per Item:", costItem);
  
      let total = parseFloat(qty) * parseFloat(costItem);
      console.log("Total Cost:", total);
  
      $("#totalCost").val(total);
    }
  
  console.log(
    "Quantity:",
    $("#quantity").val(),
    "Cost per Item:",
    $("#costPerItem").val()
  );
  
  // Event listener for changes in quantity or cost per item
  $("#quantity, #costPerItem").on("input", function () {
    updateTotalCost();
  });
  

    const foodDetail= $('#foodDetail').text().trim()
    let obj={};
    let array = foodDetail.split('\n')
    array.forEach((val)=>{
        let eachVal = val.trim()
        let eachArr= eachVal.split(':')
       
        obj[eachArr[0]]=eachArr[1].trim()
    })
    const unitVal = obj['Unit']
    const statusVal = obj['Status']
    const categoryVal =obj['Category']
    
    $('#status').val(statusVal)
    $('#unit').val(unitVal)
    $('#category').val(categoryVal)

    const checkString = (strVal, varName='input') =>{
        if (!strVal) throw `Error: You must supply a ${varName}!`;
      if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
      strVal = strVal.trim();
      if (strVal.length === 0)
        throw `Error: ${varName} cannot be an empty string or string with just spaces`;
      if (!isNaN(strVal))
        throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
      return strVal;
    }
    const checkNum = (numVal, varName='Number') =>{
        if(!numVal) throw `Error: You must provide an ${varName} `;
        
        numVal=Number(numVal)
        if (typeof numVal !== 'number') throw `Error: ${varName} must be a number`;
        
        if (isNaN(numVal)) {
          throw `${varName || 'provided variable'} is NaN`;
        }
        return numVal;
    }
    const checkUnit =(unitVal, varName='Unit')=>{
        unitVal = checkString(unitVal, "Unit");
        unitVal=unitVal.toLowerCase();
        const unitStd=['tsp','tbsp','cup','pt','qt','gal','oz','floz','lb']
        if(!(unitStd.includes(unitVal))){
          throw `Provide only standard unit values`
  
        }
        return unitVal;
    }
    const checkCategory = (categoryVal, varName='Category') => {
      categoryVal = checkString(categoryVal, "Category");
  
      const categoryOptions = [
          "Milk & Cream", "Cheese", "Yogurt", "Eggs", "Butter & Margarine",
          "Beef", "Pork", "Chicken", "Turkey", "Lamb",
          "Fish", "Shellfish", "Canned Seafood",
          "Citrus Fruits", "Berries", "Tropical Fruits", "Apples & Pears", "Stone Fruits",
          "Leafy Greens", "Root Vegetables", "Squashes", "Cruciferous Vegetables", "Nightshade Vegetables",
          "Rice", "Pasta", "Bread", "Cereal", "Oats",
          "Beans", "Lentils", "Peas", "Chickpeas",
          "Almonds", "Peanuts", "Sunflower Seeds", "Chia Seeds", "Flax Seeds",
          "Juices", "Sodas", "Tea & Coffee", "Alcoholic Beverages", "Water",
          "Chips & Crackers", "Candy & Chocolate", "Baked Goods", "Ice Cream & Desserts",
          "Herbs & Spices", "Sauces & Dressings", "Oils & Vinegars", "Condiments",
          "Frozen Vegetables", "Frozen Fruits", "Frozen Meals", "Ice Cream",
          "Canned Vegetables", "Canned Fruits", "Preserves & Spreads", "Pickles",
          "Gluten-Free", "Vegan", "Organic", "Non-Dairy Alternatives",
          "Miscellaneous", "Non-Food Items"
      ];
  
      if (!categoryOptions.includes(categoryVal)) {
          throw `Provide only valid category values`;
      }
  
      return categoryVal;
    }
    const checkStatus =(statusVal, varName='Status')=>{
      statusVal = checkString(statusVal,"Status");
      //statusVal=statusVal.toLowerCase();
      const statusOption=["Fresh","Good","Near Expiry","Expired","Spoiled","Frozen","Canned","Dried","Partially Used","Reserved","Donation Ready","Needs Review"]
      if(!(statusOption.includes(statusVal))){
        throw `Provide only valid Status values from the option`

      }
      return statusVal;
    }

    const checkDate =(dateVal, varName='Date')=>{
        if(!dateVal) throw`Error: You must provide an ${varName}`;
        dateVal =dateVal.trim()
        const dateCheck = new Date(dateVal )
        if(isNaN(dateCheck)){
          throw "Invalid  Date "
          
        }
        const dateStr = dateVal.split('-')
        
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
        function checkLeapYear(year) {
          year = parseInt(year)
    
          //three conditions to find out the leap year
          if ((0 == year % 4) && (0 != year % 100) || (0 == year % 400)) {
              return true
          } else {
              return false
          }
        }
    
        const tocheckLeap = checkLeapYear(year);
        if(mon == '02'){
          if(tocheckLeap){
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
        currentDate.setHours(0, 0, 0, 0); // Set the time of the current date to midnight

        dateCheck.setHours(0, 0, 0, 0);
        if(dateCheck < currentDate){
          throw "Expiry date should be greater than current date."
        }
        return dateVal;
    }

    editForm.submit((event)=>{
        event.preventDefault();
        let itemName =$('#itemName').val()
        let quantity =$('#quantity').val()
        let unit =$('#unit').val()
        let expiryDate =$('#expiryDate').val()
        let costPerItem =$('#costPerItem').val()
        let totalCost =$('#totalCost').val()
        let brand =$('#brand').val()
        let category =$('#category').val()
        let status=$('#status').val()
        //let pass=false
        let errorList=[]
        
        $('.error').remove();
        try{
            const item= checkString(itemName, "Item Name");
        }catch(e){
            errorList.push(e)
        }
        try{
            const quant=checkNum(quantity, "Quantity");
        }catch(e){
            errorList.push(e)
        }
        try{
            const ut=checkUnit(unit,"Unit");
        }catch(e){
            errorList.push(e)
        }
        try{
            const date=checkDate(expiryDate, "Expiry Date");
        }catch(e){
            errorList.push(e)
        }
        try{
            const cost=checkNum(costPerItem, "Cost per Item");
        }catch(e){
            errorList.push(e)
        }
        try{
            const tcost=checkNum(totalCost, "Total Cost");
        }catch(e){
            errorList.push(e)
        }
        try{
            const brnd=checkString(brand, "Brand");
        }catch(e){
            errorList.push(e)
        }
        try{
           const cat=checkCategory(category, "Category");
        }catch(e){
            errorList.push(e)
        }
        try{
            const stat=checkStatus(status, "Status");
        }catch(e){
            errorList.push(e)
        }
        if(errorList.length>0){
            let errorDisplay = `<ul class="error"> `;
            for (let error of errorList){
                errorDisplay += `<li>${error}</li>`;
            }
            errorDisplay += `</ul>`;
            editForm.append(errorDisplay)
        }
        
        
        if(errorList.length ===0){
            editForm[0].submit();
        }
        
    })


    
});