const jwt = require("jsonwebtoken");
const User = require("./User");

const authenticateToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Access Denied! No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");

    const user = await User.findById(decoded.id).select("id name email contact");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      contact: user.contact,
    };

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token!" });
  }
};

module.exports = authenticateToken;
