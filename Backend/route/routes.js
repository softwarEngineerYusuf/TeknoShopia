const router = require("express").Router();
const authRouter = require("./authRouter.js");
const userRouter = require("./userRouter.js");
const categoryRouter = require("./categoryRouter.js");
const brandRouter = require("./brandRouter.js");
const addressRouter = require("./addressRouter.js");
const productRouter = require("./productRouter.js");
const reviewRouter = require("./reviewRouter.js");
const orderRouter = require("./orderRouter.js");
const orderItemRouter = require("./orderItemRouter.js");
const billingAddressRouter = require("./billingAddressRouter.js");
const shippingAddressRouter = require("./shippingAddressRouter");

const base = "/api";

router.use(`${base}/auth`, authRouter); //localhost:3000/api/auth
router.use(`${base}/user`, userRouter); //localhost:3000/api/user
router.use(`${base}/category`, categoryRouter); //localhost:3000/api/category
router.use(`${base}/brand`, brandRouter); //localhost:3000/api/category
router.use(`${base}/address`, addressRouter); //localhost:3000/api/address
router.use(`${base}/product`, productRouter); //localhost:3000/api/product
router.use(`${base}/review`, reviewRouter); //localhost:3000/api/review
router.use(`${base}/order`, orderRouter); //localhost:3000/api/order
router.use(`${base}/orderItem`, orderItemRouter); //localhost:3000/api/orderItem
router.use(`${base}/billingAddress`, billingAddressRouter); //localhost:3000/api/billingAddress
router.use(`${base}/shippingAddress`, shippingAddressRouter); //localhost:3000/api/shippingAddress

module.exports = router;
