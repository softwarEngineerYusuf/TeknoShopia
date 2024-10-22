const express =require("express");
const bodyParser = require('body-parser');
const dotenv = require("dotenv"); 
const dbConnect =require("./dbConnect/db.js")
const routes = require("./routes/routes.js")
const cookieParser = require('cookie-parser');
dotenv.config();

const app =express();
app.use(bodyParser.json());

app.use(cookieParser());
app.use("/",routes)



app.listen(process.env.PORT || 5000,()=>{
    dbConnect()
    console.log(`Server is running on ${process.env.PORT || 5000}`)
   
})

