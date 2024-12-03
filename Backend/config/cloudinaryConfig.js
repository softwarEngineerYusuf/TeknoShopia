const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_URL.split("@")[1], // dppk4fl8i
  api_key: process.env.CLOUDINARY_URL.split("//")[1].split(":")[0], // 755269573825354
  api_secret: process.env.CLOUDINARY_URL.split(":")[2].split("@")[0], // 6f3xWKZlp2TB7KnZwnuaNvX5-yg
});
module.exports = cloudinary;
