const express = require("express");
const router = express.Router();
const multer = require("multer");

const FoundItem = require("./FoundItem");
const authenticateToken = require("./middleware/authMiddleware");
const { foundItemStorage } = require("./config/cloudinary");

const upload = multer({ storage: foundItemStorage });

router.post(
  "/view-found",
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

      const newItem = new FoundItem({
        itemName,
        description,
        location,
        date,
        image: req.file.path, 
        founderName: req.user.name,
        founderContact: req.user.contact,
        userId: req.user.id, 
      });

      await newItem.save();
      res.status(201).json({ message: "Found item reported successfully!", item: newItem });
    } catch (err) {
      console.error(" Error in POST /found-item:", err);
      res.status(500).json({ message: "Failed to report item", error: err.message });
    }
  }
);

router.get("/", authenticateToken, async (req, res) => {
  try {
    const items = await FoundItem.find().sort({ date: -1 });
    res.status(200).json({ items });
  } catch (err) {
    console.error(" Error in GET /view-found:", err);
    res.status(500).json({ message: "Failed to fetch items", error: err.message });
  }
});

module.exports = router;
