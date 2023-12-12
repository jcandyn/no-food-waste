$(document).ready(function(){
    const searchBtn = $('#searchBtn')
    const divDisplay = $('#display')
    
    
    searchBtn.click(function(){
        divDisplay.show()
    })
})

// document.addEventListener('DOMContentLoaded', function () {
//     let foodBanks = document.querySelectorAll('.food-bank');

//     foodBanks.forEach(function (foodBank) {
//         foodBank.addEventListener('click', function () {
//             toggleContact(this.dataset.foodbank);
//         });
//     });

//     function toggleContact(foodBankId) {
//         let contactInfo = document.querySelector('[data-foodbank="' + foodBankId + '"] .contact-info');

//         if (contactInfo.style.display === 'none' || contactInfo.style.display === '') {
//             contactInfo.style.display = 'block';
//         } else {
//             contactInfo.style.display = 'none';
//         }
//     }
// });
// let requestConfig = {
//     method: 'GET',
//     url: 'http://localhost:3000/sharing'
// };
// $.ajax(requestConfig).then(function(responseMessage){
    
    
//     responseMessage.map((item)=>{
        
//         let element= $(
//             `<li> <a class="item" href="${item._links.self.href}" >${item.name}</a></li>`
//         );
//         linkElement(element);
//         ul.append(element);
        
        
//     })
//     ul.show();
//     div.hide();
    
// })