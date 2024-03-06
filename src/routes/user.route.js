const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  signout,
  verifyToken,
  // forgotpassword,
  // resetPassword,
  // getIsLoggedInUserDetails,
  // updatePassword,
  // updateUserDetails,
} = require("../controllers/user.controller");
const { isLoggedIn } = require("../middlewares/user");

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/signout").get(signout);
router.route("/verifytoken").get(verifyToken);
// router.route("/forgotpassword").post(forgotpassword);
// router.route("/password/reset/:token").post(resetPassword);
// router.route("/userdashboard").get(isLoggedIn, getIsLoggedInUserDetails);
// router.route("/password/update").post(isLoggedIn, updatePassword);
// router.route("/userdashboard/update").post(isLoggedIn, updateUserDetails);

module.exports = router;
