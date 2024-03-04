const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  brand: {
    type: String,
  },
  model: {
    type: String,
  },
  category: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  discount: {
    type: Number,
  },
  content: {
    type: String,
  }
});

module.exports = mongoose.model("Device", deviceSchema);
