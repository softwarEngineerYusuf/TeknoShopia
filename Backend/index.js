const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const dbConnect = require("./dbConnect/db.js");
const routes = require("./route/routes.js");
const session = require("express-session"); // Eklediğimiz paket
const passport = require("passport"); // Eklediğimiz paket
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_session_secret", // Session secret
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize()); // Passport'u başlat
app.use(passport.session()); // Oturum yönetimi için passport'u kullan
app.use("/", routes);

app.listen(process.env.PORT || 5000, () => {
  dbConnect();
  console.log(`Server is running on ${process.env.PORT || 5000}`);
});
