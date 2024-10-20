const router = require("express").Router();
const auth=require("../route/auth.js")

const base = "/api" 

router.use(`${base}`,auth) //localhost:3000/api

module.exports=router;