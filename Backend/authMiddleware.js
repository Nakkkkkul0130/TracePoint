const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Access Denied! No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract token part

  jwt.verify(token, process.env.JWT_SECRET || "supersecretkey", (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token!" });
    req.user = user; // decoded payload
    next();
  });
};

module.exports = authenticateToken;
