require('dotenv').config()
const mongoose = require('mongoose');
const express = require('express');
var bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cors= require("cors");

const app= express();

mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex:true
}).then(()=>{
    console.log("DB CONNECTED");
}).catch(()=>{
    console.log("DB GOT OOPSS")
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors())


const port= process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`App is running at ${port}`);
})