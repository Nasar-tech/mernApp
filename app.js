
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const cookieParser=require("cookie-parser");
app.use(cookieParser());



//inbuild middlewares
app.use(express.json());

//connecting to Database
require('./DB/conn');

//Routes
app.use('',require('./routers/auth'));


//heroku
if(process.env.NODE_ENV=="production"){
    app.use(express.static("client/build"));
}


//app listening
const PORT=process.env.PORT||5000;
app.listen(PORT,()=>console.log(`running on ${PORT} `));

