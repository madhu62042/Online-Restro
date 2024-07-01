const express = require('express')
const app = express()
const path = require ('path');
const ejs = require('ejs')
const expressLayouts = require('express-ejs-layouts')

const PORT = process.env.PORT || 6007

//Assets
app.use(express.static('public'))

app.get('/', (req, res)=>{
    res.render('home');
})

app.use(expressLayouts)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

app.listen(PORT,()=>{
    console.log(`server listen on port ${PORT}`)
})