const express = require("express");
const multer = require("multer");
const { lostItemStorage } = require("./config/cloudinary");
const authenticateToken = require("./authMiddleware");
const ReportLost = require("./ReportLostItem");
const User = require("./User");

const router = express.Router();
const upload = multer({ storage: lostItemStorage });

router.post(
  "/report-lost",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const { itemName, description, location, date } = req.body;

      if (!itemName || !description || !location || !date || !req.file) {
        return res.status(400).json({ message: "All fields including image are required." });
      }

      const user = await User.findById(req.user.id).select("name contact");
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const newReport = new ReportLost({
        itemName,
        description,
        location,
        date,
        image: req.file.path,
        userId: req.user.id,
        founderName: user.name,
        founderContact: user.contact,
      });

      await newReport.save();
      res.status(201).json({ message: "Lost item reported", item: newReport });
    } catch (error) {
      console.error("Error in POST /report-lost:", {
        message: error.message,
        stack: error.stack,
        body: req.body,
        file: req.file,
        user: req.user,
      });
      res.status(500).json({ message: "Failed to save report", error: error.message });
    }
  }
);


router.get("/report-lost", authenticateToken, async (req, res) => {
  try {
    const items = await ReportLost.find().sort({ createdAt: -1 });
    res.status(200).json({ items });
  } catch (error) {
    console.error("Error in GET /report-lost:", error);
    res.status(500).json({ message: "Failed to fetch lost items", error: error.message });
  }
});

router.get("/found-items", authenticateToken, async (req, res) => {
  try {
    const items = await ReportLost.find().sort({ createdAt: -1 });
    res.status(200).json({ items });
  } catch (error) {
    console.error("Error in GET /found-items:", error);
    res.status(500).json({ message: "Failed to fetch found items", error: error.message });
  }
});

module.exports = router;
