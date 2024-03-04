const express = require("express");
const router = express.Router();
const {
    getDevices,
    addDevices,
    deleteDevices,
} = require("../controllers/devices.controller");

router.get("/devices", getDevices);
router.post("/devices", addDevices);
router.delete("/devices/:id", deleteDevices);

module.exports = router;