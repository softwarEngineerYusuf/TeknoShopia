const express =require("express");
const dotenv = require("dotenv"); 
dotenv.config();
const dbConnect =require("./dbConnect/db.js")

const app =express();

app.get("/", (req,res)=>{
    res.send("first request")
})




app.listen(process.env.PORT || 5000,()=>{
    dbConnect()
    console.log(`Server is running on ${process.env.PORT || 5000}`)
   
})

