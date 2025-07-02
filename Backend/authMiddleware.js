const jwt = require("jsonwebtoken");
const User = require("./User");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  console.log("💡 AUTH TOKEN RECEIVED:", token);

  if (!token) {
    return res.status(401).json({ message: "Access Denied! No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");

    // Optional: verify user still exists (robustness check)
    const user = await User.findById(decoded.id).select("_id name email contact");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    req.user = decoded; // Or optionally: req.user = user;
    next();
  } catch (err) {
    console.error("❌ JWT error:", err.message);
    return res.status(403).json({ message: "Invalid or expired token!" });
  }
};

module.exports = authenticateToken;
