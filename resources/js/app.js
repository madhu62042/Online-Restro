import axios from 'axios'
import Noty from 'noty'
import initAdmin from './admin.js';

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')

function updatecart(pizza){
    axios.post('/update-cart',pizza).then(res =>{
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type:'success',
            timeout:1000,
            text: "Item added to cart"
          }).show();
    }).catch(err=>{
        new Noty({
            type:'error',
            timeout:1000,
            text: "Something went wrong"
          }).show();
    })
}

addToCart.forEach((btn)=>{
     btn.addEventListener('click',(e)=>{

        let pizza = JSON.parse(btn.dataset.pizza)
        console.log(pizza)
        updatecart(pizza)

     })
})

//Remove alert message after x second

const alertMsg = document.querySelector('#success-alert')

if(alertMsg){
    setTimeout(()=>{
        alertMsg.remove()
    },2000)
}

initAdmin()