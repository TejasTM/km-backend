const app = require("./src/app");
const connectWithDb = require("./src/config/db");
const cloudinary = require("cloudinary");

// connect with database
connectWithDb();

// //cloudinary config goes here
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET,
// });
