const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ⬅️ POST /signup
router.post("/signup", async (req, res) => {
  try {
    const { name, contact, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, contact, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "Signup successful!" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error signing up", error: error.message });
  }
});

// ⬅️ POST /login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        contact: user.contact,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

// ⬅️ GET /verify-token
router.get("/verify-token", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("id name email contact");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Token valid", user });
  } catch (err) {
    console.error("Token verification error:", err.message);
    res.status(403).json({ message: "Invalid or expired token" });
  }
});

module.exports = router;
