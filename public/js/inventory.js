$(document).ready(function () {

    const foodDiv = $('#addFood')
    const addButton = $('.addButton')
    const closeButton=$('.closeButton')
    const form=$('#addFood-form')
    const errorList=$('.error-list')
    const formAddButton=$('#formAddButton')
    //form.hide();
    //foodDiv.hide();
    //closeButton.hide();
    addButton.hide();

   addButton.click(function () {
        foodDiv.addClass("active");
        addButton.hide();
        foodDiv.show();
        form.show();
        //errorList.remove();
        closeButton.show()
        
        
    });
    closeButton.click(function () {
        foodDiv.removeClass("active");
        addButton.show();
        foodDiv.hide();
        form.hide();
        errorList.remove();
        closeButton.hide();

        
    });
    

})
