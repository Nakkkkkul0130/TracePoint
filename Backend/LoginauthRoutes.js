const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./User");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

// 📌 Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, contact, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists! Please login." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, contact, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "Signup successful!" });

  } catch (error) {
    res.status(500).json({ message: "Error signing up", error });
  }
});

// 📌 Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found! Please signup first." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials!" });

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful!", token });

  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

module.exports = router;
