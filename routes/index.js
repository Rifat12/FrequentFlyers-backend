const express = require("express");
const router = express.Router();
const flightRoutes = require("./flightRoutes");
const genRoutes = require("./genRoutes");

// router.use("api/", genRoutes);
router.use("/flight", flightRoutes);

module.exports = router;
