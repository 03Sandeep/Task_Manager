const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    // Create a new user
    user = new User({
      name,
      email,
      password, // Store the hashed password
    });

    await user.save();

    // Create and return JWT
    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ensure email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password." });
    }

    // Trim email and password to avoid leading/trailing spaces
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Check if user exists
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      console.log(`Login attempt with non-existent email: ${trimmedEmail}`);
      return res
        .status(401)
        .json({ message: "Invalid credentials: Email not found" });
    }

    // Log the user object (excluding password) for debugging
    console.log("User found: ", { email: user.email, id: user.id });
    // Check password match
    console.log(`Store is db is ${user.password}`);
    const isMatch = await user.comparePassword(password);
    console.log(isMatch);
    if (!isMatch) {
      console.log(`Failed login attempt for email: ${trimmedEmail}`);
      return res
        .status(401)
        .json({ message: "Invalid credentials: Incorrect password" });
    }

    // Create and return JWT token
    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, {
      expiresIn: "7d", // Token expiration time
    });

    // Respond with the token
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Protected route handler
exports.protectedRoute = (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
};
