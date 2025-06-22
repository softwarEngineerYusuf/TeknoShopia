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
const cartRouter = require("./cartRouter");
const cartItemRouter = require("./cartItemRouter");
const emailRoutes = require("./emailRouter");
const cardRouter = require("./cardsRouter.js");
const favoritesRouter = require("./favoritesRouter.js");
const couponRouter = require("./couponRouter.js");
const base = "/api";

router.use(`${base}/auth`, authRouter); //localhost:5000/api/auth
router.use(`${base}/user`, userRouter); //localhost:5000/api/user
router.use(`${base}/category`, categoryRouter); //localhost:5000/api/category
router.use(`${base}/brand`, brandRouter); //localhost:5000/api/brand
router.use(`${base}/address`, addressRouter); //localhost:5000/api/address
router.use(`${base}/product`, productRouter); //localhost:5000/api/product
router.use(`${base}/review`, reviewRouter); //localhost:5000/api/review
router.use(`${base}/order`, orderRouter); //localhost:5000/api/order
router.use(`${base}/orderItem`, orderItemRouter); //localhost:5000/api/orderItem
router.use(`${base}/billingAddress`, billingAddressRouter); //localhost:5000/api/billingAddress
router.use(`${base}/shippingAddress`, shippingAddressRouter); //localhost:5000/api/shippingAddress
router.use(`${base}/cart`, cartRouter); //localhost:5000/api/cart
router.use(`${base}/cartItem`, cartItemRouter); //localhost:5000/api/cartItem
router.use(`${base}/email`, emailRoutes);
router.use(`${base}/card`, cardRouter); //localhost:5000/api/card
router.use(`${base}/favorites`, favoritesRouter);
router.use(`${base}/coupon`, couponRouter);
module.exports = router;
