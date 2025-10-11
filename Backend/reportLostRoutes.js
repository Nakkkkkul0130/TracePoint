// reportLostRoutes.js
const express = require("express");
const multer = require("multer");
const { lostItemStorage } = require("./config/cloudinary"); //make sure this is correct
const authenticateToken = require("./middleware/authMiddleware");
const ReportLost = require("./models/ReportLostItem");
const User = require("./models/User");

const router = express.Router();
const upload = multer({ storage: lostItemStorage }); // Using Cloudinary

// POST /report-lost
// POST /report-lost
router.post(
  "/report-lost",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const { itemName, description, location, date } = req.body;

      if (!itemName || !description || !location || !date || !req.file) {
        return res
          .status(400)
          .json({ message: "All fields including image are required." });
      }

      const user = await User.findById(req.user.id).select("name contact");
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const newReport = new ReportLost({
        itemName,
        description,
        location,
        date: new Date(date),
        image: req.file.path,
        userId: req.user.id,
        founderName: user.name,
        founderContact: user.contact,
      });

      await newReport.save();

      return res
        .status(201)
        .json({ message: "Lost item reported", item: newReport });
    } catch (error) {
      console.error(" Caught Error in POST /report-lost");
      console.error("Type:", typeof error);
      console.error("Error object:", error);
      console.error("Error message:", error?.message);
      console.error("Request user:", req.user);
      console.error("Request body:", req.body);
      console.error("Request file:", req.file);

      return next(error); //  Pass error to middleware
    }
  }
);

// GET /report-lost - Get all items except user's own
router.get("/report-lost", authenticateToken, async (req, res) => {
  try {
    const items = await ReportLost.find({ userId: { $ne: req.user.id } }).sort({ createdAt: -1 });
    res.status(200).json({ items });
  } catch (error) {
    console.error("Error in GET /report-lost:", error);
    res.status(500).json({ message: "Failed to fetch lost items", error: error.message });
  }
});

// GET /my-reports - Get user's own reports
router.get("/my-reports", authenticateToken, async (req, res) => {
  try {
    const items = await ReportLost.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ items });
  } catch (error) {
    console.error("Error in GET /my-reports:", error);
    res.status(500).json({ message: "Failed to fetch my reports", error: error.message });
  }
});



module.exports = router;
