const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("./User");

const router = express.Router();

// 📌 Signup Route (Registers a New User)
router.post("/signup", async (req, res) => {
  try {
    const { name, contact, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists!" });

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, contact, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "Signup successful!" });

  } catch (error) {
    res.status(500).json({ message: "Error signing up", error });
  }
});

module.exports = router;
