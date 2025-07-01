const express = require("express");
const jwt = require("jsonwebtoken");
const ReportLost = require("./ReportLostItem");
const FoundItem = require("./FoundItem");

const router = express.Router();
const SECRET_KEY = process.env.ADMIN_SECRET || "adminsecret";
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "admin123";

function authenticateToken(req, res, next) {
  const token = req.cookies?.adminToken;
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

function verifyAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
}

router.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ role: "admin", username }, SECRET_KEY, { expiresIn: "2h" });

    res
      .cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None", 
        maxAge: 2 * 60 * 60 * 1000, 
      })
      .status(200)
      .json({ message: "Admin login successful" });
  } else {
    res.status(401).json({ message: "Invalid admin credentials" });
  }
});

router.post("/admin/logout", (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    sameSite: "None",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Logged out successfully" });
});

router.get("/admin/lost-items", authenticateToken, verifyAdmin, async (req, res) => {
  const items = await ReportLost.find();
  res.json(items);
});

router.get("/admin/found-items", authenticateToken, verifyAdmin, async (req, res) => {
  const items = await FoundItem.find();
  res.json(items);
});

router.delete("/admin/lost-items/:id", authenticateToken, verifyAdmin, async (req, res) => {
  await ReportLost.findByIdAndDelete(req.params.id);
  res.json({ message: "Lost item deleted" });
});

router.delete("/admin/found-items/:id", authenticateToken, verifyAdmin, async (req, res) => {
  await FoundItem.findByIdAndDelete(req.params.id);
  res.json({ message: "Found item deleted" });
});

module.exports = router;
