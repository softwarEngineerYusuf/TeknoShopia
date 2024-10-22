const router = require("express").Router();
const auth=require("../route/auth.js")
const userRouter =require("../route/userRouter.js")
const base = "/api" 

router.use(`${base}/auth`,auth) //localhost:3000/api/auth
router.use(`${base}/users`, userRouter); //localhost:3000/api/users

module.exports=router;