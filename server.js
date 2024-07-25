require('dotenv').config()
const express = require('express')
const app = express()
const path = require ('path');
const ejs = require('ejs')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 6028
const session = require('express-session')
const flash = require('express-flash');
const MongoStore= require('connect-mongo')
const passport = require('passport')
const Emitter = require('events')


//Database connection

const url= 'mongodb://localhost/pizza';
mongoose.connect(url,{});
const connection = mongoose.connection;
connection.once('open', ()=>{
       console.log('Database connected...');
}).on('error',(err)=>{
    console.log('connection failed:',err)
})

//Event Emitter

const eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter)
 
//session store
const mongoStore = MongoStore.create({
    client: connection.getClient(),
    dbName: 'pizza',
    collectionName: 'sessions'
})

//session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: {maxAge:1000 * 60 * 60 * 24}
}))
//session config and passport

//passport config
const passportInit = require('./app/config/passport');
const order = require('./app/models/order');
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


//flash
app.use(flash())




//Assets
app.use(express.static('public'))
app.use(express.urlencoded({extended : false}))
app.use(express.json())

//set global middleware
app.use((req,res,next)=>{
    res.locals.session = req.session
    res.locals.user = req.user
    

 next()
})
// set Template engine

app.use(expressLayouts)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

require('./routes/web')(app)




 const server = app.listen(PORT,()=>{
    console.log(`server listen on port ${PORT}`)
})

//Socket
const io = require('socket.io')(server)
io.on('connection',(socket)=>{
    //join
    console.log(socket.id)
    socket.on('join',(orderId)=>{
        console.log(orderId)
      socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data)
})

eventEmitter.on('orderPlaced',(data)=>{
     io.to('adminRoom').emit('orderPlaced',data)
})