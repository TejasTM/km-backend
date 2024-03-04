const express = require("express");
const router = express.Router();
const userRoute = require("./user.route");
const postRoute = require("./post.route");
const deviceRoute= require("./devices.route")

router.use(userRoute);
router.use(postRoute);
router.use(deviceRoute);

module.exports = router;
