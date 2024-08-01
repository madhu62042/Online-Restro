import axios from 'axios'
import Noty from 'noty'
import initAdmin from './admin.js'
import moment from 'moment'


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



//Change order status
let statuses = document.querySelectorAll('.status_line')
let order = document.querySelector('#hiddenInput') ? document.querySelector('#hiddenInput').value:null
order=JSON.parse(order)
console.log(order)
let time = document.createElement('small')

function updateStatus(order){
    statuses.forEach((status)=>{
      
        status.classList.remove('step-completed')
        status.classList.remove('current')

     })
    let stepCompleted = true
    statuses.forEach((status)=>{
        let dataProp = status.dataset.status

        if( stepCompleted ){
            status.classList.add('step-completed')
        }

        if(dataProp === order.status){
            stepCompleted=false
             
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)

            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current')
            }
            
        }
    })

}

updateStatus(order)


//socket

let socket = io()


//join

if(order){
    socket.emit('join',`order_${order._id}`)
}

 let adminAreaPath = window.location.pathname
 console.log(adminAreaPath)

 if(adminAreaPath.includes('admin')){
    initAdmin(socket)
    socket.emit('join','adminRoom')
 }

socket.on('orderUpdated',(data)=>{
    const updatedOrder = {...order}
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)

})