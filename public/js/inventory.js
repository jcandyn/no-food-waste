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
    const unitStd = ["tsp", "tbsp", "c", "pt", "qt", "gal", "oz", "floz", "lb"];
    if (!unitStd.includes(unitVal)) {
      throw `Provide only standard unit values`;
    }
    return unitVal;
  };

  const checkDate = (dateVal, varName = "Date") => {
    if (!dateVal) throw `Error: You must provide an ${varName}`;
    dateVal = dateVal.trim();
    const dateCheck = new Date(dateVal);
    if (isNaN(dateCheck)) {
      throw "Invalid  Date ";
    }
    const dateStr = dateVal.split("-");

    const year = dateStr[0];
    const date = dateStr[2];
    const mon = dateStr[1];

    if (mon.length != 2 || date.length != 2 || year.length != 4) {
      throw `Enter date: ${dateVal} in MM/DD/YYYY format.`;
    }

    if (!(mon >= 1 && mon <= 12))
      throw "Month value is not valid, enter value between 1-12";
    const day31 = ["01", "03", "05", "07", "08", "10", "12"];
    const day30 = ["04", "06", "09", "11"];
    if (day31.includes(mon)) {
      if (!(date >= 1 && date <= 31)) {
        throw "Invalid date ";
      }
    }
    if (day30.includes(mon)) {
      if (!(date >= 1 && date <= 30)) {
        throw "Invalid input, day should be between 1-30 ";
      }
    }
    if (mon == "02") {
      if (isLeapYear(year)) {
        if (!(date >= 1 && date <= 29)) {
          throw "Leap year feb should have date in between 1-29";
        }
      } else {
        if (!(date >= 1 && date <= 28)) {
          throw "Feb should have date in between 1-28";
        }
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
    let totalCost = $("#totalCost").val();
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
