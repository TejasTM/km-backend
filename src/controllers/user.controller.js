const User = require("../models/user.model");
const cookieToken = require("../utils/cookieToken");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");
// const mailHelper = require("../utils/emailHelper");
const crypto = require("crypto");
const jwt = require('jsonwebtoken');

// Function to generate JWT token with payload
const generateJwtToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 86400 }); // Expires in 86400 seconds (1 day)
};


// Function to handle signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, gender, termsAndConditions,role } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email address is already registered, Try signIn",
      });
    }

    // Create a new user if email is not already registered
    const user = await User.create({
      name,
      email,
      password,
      gender,
      termsAndConditions,
      role
    });

    const tokenPayload = {
      success: true,
      userName: user.name,
      email: user.email,
    };

    const token = generateJwtToken(tokenPayload);

    // Send response with token
    res.cookie("token", token, {
      expires: new Date(Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000),
      httpOnly: true
    }).json({
      success: true,
      message: "User signed up successfully",
      token,
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// signin user
exports.signin = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "You don't have an account, try signing up",
      });
    }
    
    const isValidatedUser = await user.isValidatedPassword(password);

    if (!isValidatedUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // If user is validated, create and send token
    const tokenPayload = {
      success: true,
      userName: user.name,
      email: user.email,
    };

    const token = generateJwtToken(tokenPayload);

    // Send response with token
    res.cookie("token", token, {
      expires: new Date(Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000),
      httpOnly: true
    }).json({
      success: true,
      message: "User signed in successfully",
      token,
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// signout user
exports.signout = async (req, res) => {
  try {
    // Clear the token cookie by setting it to expire in the past
    res.clearCookie('token').json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// forget password
exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    // Implement logic to send reset password email to the user
    // For example, send an email with a link to reset password

    res.json({
      success: true,
      message: "Password reset instructions have been sent to your email",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    // Implement logic to verify the reset password token
    // For example, decode the token and check its validity

    // If token is valid, update the user's password
    // Note: This code assumes the token has already been verified and decoded
    const user = await User.findById(token.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Set new password and save user
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get signed in user details
exports.getIsLoggedInUserDetails = async (req, res, next) => {
  const user = await User.findById({ _id: req.userId });
  user.password = undefined;
  res.status(200).send(user);
};

// update password
exports.updatePassword = async (req, res, next) => {
  const { password, newPassword } = req.body;

  const user = await User.findById({ _id: req.userId }).select("+password");

  if (!user.isValidatedPassword(password)) {
    res.status(400).json({
      success: false,
      message: "Please enter correct password",
    });
  }

  user.password = newPassword;
  await user.save();

  cookieToken(user, res);
};

// update user profile
exports.updateUserDetails = async (req, res, next) => {
  const { name, email } = req.body;

  // validate request data
  if (!name && !email && !req.files) {
    res.status(400).json({
      success: false,
      message: "Provide some information to update",
    });
  }

  let newData = {};

  if (name) {
    newData.name = name;
  }

  if (email) {
    newData.email = email;
  }

  // image update
  if (req.files) {
    const user = await User.findById({ _id: req.userId });
    const imageId = user.photo.id;
    await cloudinary.v2.uploader.destroy(imageId);
    const result = await cloudinary.v2.uploader.upload(
      req.files.photo.tempFilePath,
      { folder: "users", width: 150, crop: "scale" }
    );
    newData.photo = {
      id: result.public_id,
      secure_url: result.secure_url,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(
    { _id: req.userId },
    newData,
    { new: true, runValidators: true, useFindAndModify: false }
  );

  updatedUser.password = undefined;

  return res.status(201).json({
    success: true,
    user: updatedUser,
  });
};
