const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const isLoggedIn = async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    res.status(401).json({
      success: false,
      message: "You need to login first",
    });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded) {
    req.userId = decoded.id;
    next();
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

module.exports = { isLoggedIn };
