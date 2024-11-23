"use strict";

const express = require("express");
const router = express.Router();
const flightRoutes = require("./flightRoutes");
const { router: authRoutes } = require("./authRoutes");
const tripRoutes = require("./tripRoutes");
const authMiddleware = require("../middleware/auth");

// Auth routes (no authentication required)
router.use("/auth", authRoutes);

// Protected routes (require authentication)
router.use("/trips", authMiddleware, tripRoutes);
router.use("/flights", authMiddleware, flightRoutes);

module.exports = router;
