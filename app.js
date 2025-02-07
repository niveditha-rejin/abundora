const express=require("express");
const app=express();
require("dotenv").config();
 
const db=require("./config/db");
db();
//const port = process.env.PORT ||3000
app.listen(process.env.PORT,()=>{
    console.log('Server running on port 3000');
});

module.exports=app;
