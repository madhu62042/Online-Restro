require('dotenv').config()
const express = require('express')
const app = express()
const path = require ('path');
const ejs = require('ejs')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 6026
const session = require('express-session')
const flash = require('express-flash');
const { collection } = require('./app/models/menu');
const MongoStore= require('connect-mongo')


//Database connection

const url= 'mongodb://localhost/pizza';
mongoose.connect(url,{});
const connection = mongoose.connection;
connection.once('open', ()=>{
       console.log('Database connected...');
}).on('error',(err)=>{
    console.log('connection failed:',err)
})
 
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

app.use(flash())




//Assets
app.use(express.static('public'))
app.use(express.json())

//set global middleware
app.use((req,res,next)=>{
 res.locals.session = req.session
 next()
})
// set Template engine

app.use(expressLayouts)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

require('./routes/web')(app)




app.listen(PORT,()=>{
    console.log(`server listen on port ${PORT}`)
})