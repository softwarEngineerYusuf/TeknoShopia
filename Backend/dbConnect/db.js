const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI
     );
    console.log("Database has been connected successfully");
  } catch (error) {
    console.log("Database connection error:", error);
  }
};

module.exports = dbConnect;