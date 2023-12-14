$(document).ready(function () {
  const foodDiv = $("#addFood");
  const addButton = $(".addButton");
  const closeButton = $(".closeButton");
  const form = $("#addFood-form");
  const errorList = $(".error-list");
  const clear = $("#clearBtn");
  //const shareBtn = $('#shareBtn')
  // const formAddButton=$('#formAddButton')

  form.hide();
  foodDiv.hide();
  closeButton.hide();
  //addButton.hide();

  // Function to format currency
  function formatCurrency(value) {
    return "$" + parseFloat(value).toFixed(2);
  }

  // Function to calculate and update total cost
  /*
  function updateTotalCost() {
    // Inside updateTotalCost function
    let qty = parseFloat($('#quantity').val()) || 0; // Default to 0 if not a number
    let costItem = parseFloat($('#costPerItem').val().replace('$', '')) || 0; // Default to 0 if not a number
    let total = qty * costItem;
    $('#totalCost').val(formatCurrency(total));
  }*/
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

  addButton.click(function () {
    foodDiv.addClass("active");
    addButton.hide();
    foodDiv.show();
    form.show();
    //errorList.remove();
    closeButton.show();
  });
  closeButton.click(function () {
    foodDiv.removeClass("active");
    addButton.show();
    foodDiv.hide();
    form.hide();
    errorList.remove();
    $(".error").remove();
    clear.click();
    closeButton.hide();
  });
  const checkString = (strVal, varName = "input") => {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  };
  const checkNum = (numVal, varName = "Number") => {
    if (!numVal) throw `Error: You must provide an ${varName} `;

    numVal = Number(numVal);
    if (typeof numVal !== "number") throw `Error: ${varName} must be a number`;

    if (isNaN(numVal)) {
      throw `${varName || "provided variable"} is NaN`;
    }
    return numVal;
  };
  const checkUnit = (unitVal, varName = "Unit") => {
    unitVal = checkString(unitVal, "Unit");
    unitVal = unitVal.toLowerCase();
    const unitStd = [
      "tsp",
      "tbsp",
      "cup",
      "pt",
      "qt",
      "gal",
      "oz",
      "floz",
      "lb",
    ];
    if (!unitStd.includes(unitVal)) {
      throw `Provide only standard unit values`;
    }
    return unitVal;
  };
  console.log("Year:", year, "Type:", typeof year);

  function isLeapYear(year) {
    if (typeof year !== "number") {
      throw new TypeError(
        `Expected year to be of type 'number', got '${typeof year}'`
      );
    }
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  // Test the function
  console.log(isLeapYear(2020)); // Expected: true
  console.log(isLeapYear(2021)); // Expected: false

  const checkDate = (dateVal, varName = "Date") => {
    if (!dateVal) throw `Error: You must provide a ${varName}`;
    dateVal = dateVal.trim();
    const dateCheck = new Date(dateVal);
    if (isNaN(dateCheck)) {
      throw "Invalid Date";
    }

    // Split the date based on '-' (for YYYY-MM-DD format)
    const dateParts = dateVal.split("-");

    // Ensure we have the correct parts (year, month, day)
    if (dateParts.length !== 3) {
      throw `Enter date in YYYY-MM-DD format.`;
    }

    // Destructuring assignment to get year, month, and date
    const [yearStr, monStr, dateStr] = dateParts;
    const year = parseInt(yearStr, 10);  // Corrected to use yearStr
    const mon = parseInt(monStr, 10);
    const date = parseInt(dateStr, 10);

    // Convert strings to numbers
    console.log("Year:", year, "Type of year:", typeof year);
    isLeapYear(year);

  

    if (!(mon >= 1 && mon <= 12)) {
      throw "Month value is not valid, enter value between 1-12";
    }

    const day31 = [1, 3, 5, 7, 8, 10, 12];
    const day30 = [4, 6, 9, 11];

    if (day31.includes(mon) && !(date >= 1 && date <= 31)) {
      throw "Invalid date for month";
    }
    if (day30.includes(mon) && !(date >= 1 && date <= 30)) {
      throw "Invalid input, day should be between 1-30";
    }
    if (mon === 2) {
      const isLeap = isLeapYear(year);
      const maxDay = isLeap ? 29 : 28;
      if (!(date >= 1 && date <= maxDay)) {
        throw `Invalid date for February in a ${
          isLeap ? "leap" : "non-leap"
        } year`;
      }
    }

    const currentDate = new Date();
    if (dateCheck < currentDate) {
      throw "Expiry date should be greater than current date.";
    }

    return dateVal;
  };

  form.submit((event) => {
    event.preventDefault();
    let itemName = $("#itemName").val();
    let quantity = $("#quantity").val();
    let unit = $("#unit").val();
    let expiryDate = $("#expiryDate").val();
    let costPerItem = $("#costPerItem").val();
    let totalCost = parseFloat($("#totalCost").val().replace("$", ""));
    let brand = $("#brand").val();
    let category = $("#category").val();
    let status = $("#status").val();
    //let pass=false
    let errorList = [];

    $(".error").remove();
    try {
      const item = checkString(itemName, "Item Name");
    } catch (e) {
      errorList.push(e);
    }
    try {
      const quant = checkNum(quantity, "Quantity");
    } catch (e) {
      errorList.push(e);
    }
    try {
      const ut = checkUnit(unit, "Unit");
    } catch (e) {
      errorList.push(e);
    }
    try {
      const date = checkDate(expiryDate, "Expiry Date");
    } catch (e) {
      errorList.push(e);
    }
    try {
      const cost = checkNum(costPerItem, "Cost per Item");
    } catch (e) {
      errorList.push(e);
    }

    try {
      const tcost = checkNum(totalCost, "Total Cost");
    } catch (e) {
      errorList.push(e);
    }
    try {
      const brnd = checkString(brand, "Brand");
    } catch (e) {
      errorList.push(e);
    }
    try {
      const cat = checkString(category, "Category");
    } catch (e) {
      errorList.push(e);
    }
    try {
      const stat = checkString(status, "Status");
    } catch (e) {
      errorList.push(e);
    }
    if (errorList.length > 0) {
      let errorDisplay = `<ul class="error"> `;
      for (let error of errorList) {
        errorDisplay += `<li>${error}</li>`;
      }
      errorDisplay += `</ul>`;
      form.append(errorDisplay);
    }

    if (errorList.length === 0) {
      form[0].submit();
    }
  });
});
