require('dotenv').config()
const mongoose = require('mongoose');
const express = require('express');
var bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cors= require("cors");

//Importing routers
const authRoute = require("./routes/auth")

const app= express();

//DB Connection
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex:true
}).then(()=>{
    console.log("DB CONNECTED");
}).catch(()=>{
    console.log("DB GOT OOPSS")
});


//Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors())

//My Routes
app.use("/api",authRoute);

//PORT
const port= process.env.PORT || 3000;

//Starting a Server
app.listen(port,()=>{
    console.log(`App is running at ${port}`);
})