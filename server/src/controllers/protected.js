const protectedRoute = (req, res) => {
  res.json({ message: "This is a protected route" });
};

module.exports = { protectedRoute };
