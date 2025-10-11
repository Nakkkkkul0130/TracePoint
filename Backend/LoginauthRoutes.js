const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";


router.post("/signup", async (req, res) => {
  try {
    const { name, contact, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists! Please login." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, contact, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "Signup successful! Please login with your credentials." });
  } catch (error) {
    res.status(500).json({ message: "Error signing up", error: error.message });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found! Please signup first." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials!" });

    const token = jwt.sign({ id: user._id, name: user.name }, SECRET_KEY, { expiresIn: "7d" });

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
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});


router.get("/verify-token", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.id).select("id name email contact");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Token valid", user });
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token", error: err.message });
  }
});


router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({ message: "Logged out successfully (if cookie was used)" });
});

module.exports = router;
