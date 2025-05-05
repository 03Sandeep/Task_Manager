const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function (req, res, next) {
  // Get token from header
  const authHeader = req.header("Authorization");

  // Check if token exists
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  // Extract token (handle different formats)
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  if (!token) {
    return res.status(401).json({ message: "No token found in header" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    // Check token structure - NOW LOOKING FOR decoded.user.id
    if (!decoded?.user?.id) {
      console.log("Malformed token payload. Received:", decoded);
      return res.status(401).json({
        message: "Malformed token payload",
        details: "Expected token with { user: { id } } structure",
      });
    }

    // Find user by id
    const user = await User.findById(decoded.user.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Add user to request object
    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      // Add other non-sensitive fields as needed
    };

    next();
  } catch (err) {
    console.error("Authentication error:", err.message);

    // Handle specific JWT errors
    let message = "Invalid token";
    if (err instanceof jwt.TokenExpiredError) {
      message = "Token expired";
    } else if (err instanceof jwt.JsonWebTokenError) {
      message = "Invalid token signature";
    }

    res.status(401).json({ message });
  }
};
