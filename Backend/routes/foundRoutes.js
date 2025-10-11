const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const ReportFoundItem = require('../models/ReportFoundItem');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Report found item
router.post('/report-found', auth, upload.single('image'), async (req, res) => {
  try {
    const { itemName, description, location, foundDate, contactInfo } = req.body;
    let imageUrl = null;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const foundItem = new ReportFoundItem({
      itemName,
      description,
      location,
      foundDate,
      contactInfo,
      image: imageUrl,
      userId: req.user.id,
      reporterName: req.user.name,
    });

    await foundItem.save();
    res.status(201).json({ message: 'Found item reported successfully', item: foundItem });
  } catch (error) {
    console.error('Error reporting found item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Browse found items (exclude user's own items)
router.get('/browse', auth, async (req, res) => {
  try {
    const items = await ReportFoundItem.find({ 
      userId: { $ne: req.user.id }
    }).sort({ createdAt: -1 });
    
    res.json({ items });
  } catch (error) {
    console.error('Error fetching found items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit found item to office
router.post('/submit-to-office/:itemId', auth, async (req, res) => {
  try {
    const item = await ReportFoundItem.findOne({
      _id: req.params.itemId,
      userId: req.user.id
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found or not yours' });
    }
    
    if (item.officeSubmissionStatus !== 'pending_submission') {
      return res.status(400).json({ message: 'Item already submitted' });
    }
    
    await ReportFoundItem.findByIdAndUpdate(req.params.itemId, {
      officeSubmissionStatus: 'submitted_to_office',
      status: 'submitted_to_office',
      submittedToOfficeAt: new Date()
    });
    
    res.json({ message: 'Item submitted to office for verification' });
  } catch (error) {
    console.error('Error submitting to office:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's found items
router.get('/my-found-items', auth, async (req, res) => {
  try {
    const items = await ReportFoundItem.find({ 
      userId: req.user.id 
    }).sort({ createdAt: -1 });
    
    res.json({ items });
  } catch (error) {
    console.error('Error fetching my found items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;