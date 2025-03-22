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
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin || "*"); // Tüm kaynaklara izin ver
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Çerezleri destekle
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

app.use(passport.initialize());
app.use(passport.session());
app.use("/", routes);

app.listen(process.env.PORT || 5000, () => {
  dbConnect();
  console.log(`Server is running on ${process.env.PORT || 5000}`);
});
