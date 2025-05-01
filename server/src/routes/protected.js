const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const { protectedRoute } = require("../controllers/protected");

const router = express.Router();

router.get("/protected", authenticateToken, protectedRoute);

module.exports = router;
