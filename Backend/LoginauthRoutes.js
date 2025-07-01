const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./User");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "None", 
  maxAge: 3600000,
};

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

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found! Please signup first." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials!" });

    const token = jwt.sign({ id: user._id, name: user.name }, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({
  message: "Login successful!",
  token,
  user: {
    id: user._id,
    name: user.name,
    ...
  }
});

  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

router.get("/login", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    res.status(200).json({ user });
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
