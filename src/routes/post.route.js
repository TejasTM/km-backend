const express = require("express");
const router = express.Router();
const {
  getPosts,
  addPost,
  deletePost,
} = require("../controllers/post.controller");
const { isLoggedIn } = require("../middlewares/user");

router.route("/posts").get(getPosts);
router.route("/posts").post(addPost);
router.route("/posts/:id").delete(isLoggedIn, deletePost);

module.exports = router;
