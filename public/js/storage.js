$(document).ready(function () {
    $("#dairyLink").click(function () {
        console.log("Clicked dairyLink");
        $("#dairyInfo").show();
        $("#meatInfo").hide();
        $("#fishInfo").hide();
        $("#pastaInfo").hide();
        $("#greensInfo").hide();
    });
  
    $("#meatLink").click(function () {
        $("#dairyInfo").hide();
        $("#meatInfo").show();
        $("#fishInfo").hide();
        $("#pastaInfo").hide();
        $("#greensInfo").hide();   
    });

    $("#fishLink").click(function () {
        $("#dairyInfo").hide();
        $("#meatInfo").hide();
        $("#fishInfo").show();
        $("#pastaInfo").hide();
        $("#greensInfo").hide();
    });

    $("#pastaLink").click(function () {
        $("#dairyInfo").hide();
        $("#meatInfo").hide();
        $("#fishInfo").hide();
        $("#pastaInfo").show();
        $("#greensInfo").hide();
    });

    $("#greensLink").click(function () {
        $("#dairyInfo").hide();
        $("#meatInfo").hide();
        $("#fishInfo").hide();
        $("#pastaInfo").hide();
        $("#greensInfo").show();
    });
});
