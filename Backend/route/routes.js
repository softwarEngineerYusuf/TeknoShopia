const router = require("express").Router();
const auth=require("./auth.js")
const userRouter =require("./userRouter.js")
const category=require("./category.js")
const brand=require("./brand.js")
const address=require("./address.js")


const base = "/api" 

router.use(`${base}/auth`,auth) //localhost:3000/api/auth
router.use(`${base}/user`, userRouter); //localhost:3000/api/user
router.use(`${base}/category`, category); //localhost:3000/api/category
router.use(`${base}/brand`, brand); //localhost:3000/api/category
router.use(`${base}/address`, address); //localhost:3000/api/address

module.exports=router;