const jwt = require("jsonwebtoken");
const User = require("./User");

const authenticateToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
console.log("💡 AUTH TOKEN RECEIVED:", token);

if (!token) return res.status(403).json({ message: "Access Denied! No token provided." });

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");
  console.log("Decoded:", decoded);
} catch (err) {
  console.error("JWT error:", err.message);
  return res.status(403).json({ message: "Invalid or expired token!" });
}
}

module.exports = authenticateToken;
