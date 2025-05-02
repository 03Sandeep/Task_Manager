const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const auth = require("../middleware/auth");

// Authentication routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected routes
router.get("/user/profile", auth, authController.getProfile);
router.get("/protected", auth, authController.protectedRoute);

module.exports = router;
