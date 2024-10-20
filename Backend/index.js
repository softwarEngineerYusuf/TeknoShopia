const express =require("express");
const bodyParser = require('body-parser');
const dotenv = require("dotenv"); 
const dbConnect =require("./dbConnect/db.js")
const routes = require("./routes/routes.js")
dotenv.config();

const app =express();
app.use(bodyParser.json());

app.use("/",routes)
app.get("/", (req,res)=>{
    res.send("first request")
})


app.listen(process.env.PORT || 5000,()=>{
    dbConnect()
    console.log(`Server is running on ${process.env.PORT || 5000}`)
   
})

