const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const dbConnect = require("./dbConnect/db.js");
const routes = require("./route/routes.js");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

// CORS'u tamamen açık hale getir
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true); // Origin'e izin ver
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_session_secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use("/", routes);

app.listen(process.env.PORT || 5000, () => {
  dbConnect();
  console.log(`Server is running on ${process.env.PORT || 5000}`);
});
