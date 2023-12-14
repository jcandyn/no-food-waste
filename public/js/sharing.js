$(document).ready(function () {
    const form =$('#foodDonation')
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

    checkState = (stateVal, varName='State')=>{
        stateVal = checkString(stateVal,"State");
        stateVal=stateVal.toLowerCase();
        const stateStd=['alabama','arizona','arkansas','california','colorado','connecticut','delaware','florida','new_jersey','new_york','north_carolina','ohio','texas','washington']
        if(!(stateStd.includes(stateVal))){
          throw `Provide only state values present in the option`
  
        }
        return stateVal;
      }

    form.submit((event) => {
        event.preventDefault();
        let state = $("#state").val();
        let errorList = [];

        $(".error").remove();
        try {
        const stateVal = checkState(state, "state");
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
    })
})