require('dotenv').config()
const express = require('express');
const cookieParser = require("cookie-parser");
const cors= require("cors");
const mongoose = require('mongoose');


//Importing routers
const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")



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
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookieParser());
app.use(cors())

//My Routes
app.use("/api",authRoute);
app.use("/api",userRoute);



//PORT
const port= process.env.PORT || 3000;

//Starting a Server
app.listen(port,()=>{
    console.log(`App is running at ${port}`);
})