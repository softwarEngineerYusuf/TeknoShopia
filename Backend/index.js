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

const corsOptions = {
  // origin fonksiyonu, gelen isteğin kaynağını kontrol eder.
  origin: function (origin, callback) {
    // Eğer istek yapan kaynak izin verilenler listesindeyse veya
    // bir origin belirtilmemişse (Postman gibi araçlar için) izin ver.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Hata yok, isteğe izin ver.
    } else {
      callback(new Error("Not allowed by CORS")); // Hata var, isteği reddet.
    }
  },
  credentials: true, // Frontend'in cookie gibi bilgileri göndermesine izin ver.
};

// CORS middleware'ini bu seçeneklerle kullan
app.use(cors(corsOptions));

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
  // console.log("Request Origin:", req.headers.origin);
  next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use("/", routes);

app.listen(process.env.PORT || 5000, () => {
  dbConnect();
  console.log(`Server is running on ${process.env.PORT || 5000}`);
});
