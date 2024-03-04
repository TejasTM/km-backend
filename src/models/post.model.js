const mongoose = require("mongoose");
const { POST_CATEGORY } = require("../utils/constants");
const { v4: uuidv4 } = require("uuid");

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const postSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4(),
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    requred: true,
    enum: POST_CATEGORY,
  },
  content: {
    type: String,
    required: true,
  },
  comments: {
    type: [commentSchema],
    default: [],
    required: false,
  },
});

module.exports = mongoose.model("Post", postSchema);
