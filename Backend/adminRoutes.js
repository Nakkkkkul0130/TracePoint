const express = require("express");
const jwt = require("jsonwebtoken");
const ReportLost = require("./models/ReportLostItem");
const ReportFoundItem = require("./models/ReportFoundItem");

const router = express.Router();
const SECRET_KEY = process.env.ADMIN_SECRET || "adminsecret";
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

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

    const cookieOptions = {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    };
    
    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
      cookieOptions.sameSite = "None";
    } else {
      cookieOptions.secure = false;
      cookieOptions.sameSite = "Lax";
    }

    res
      .cookie("adminToken", token, cookieOptions)
      .status(200)
      .json({ message: "Admin login successful" });
  } else {
    res.status(401).json({ message: "Invalid admin credentials" });
  }
});

router.post("/admin/logout", (req, res) => {
  const cookieOptions = {
    httpOnly: true,
  };
  
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
    cookieOptions.sameSite = "None";
  } else {
    cookieOptions.secure = false;
    cookieOptions.sameSite = "Lax";
  }
  
  res.clearCookie("adminToken", cookieOptions);
  res.json({ message: "Logged out successfully" });
});

router.get("/admin/lost-items", authenticateToken, verifyAdmin, async (req, res) => {
  const items = await ReportLost.find();
  res.json(items);
});

router.get("/admin/found-items", authenticateToken, verifyAdmin, async (req, res) => {
  const items = await ReportFoundItem.find();
  res.json(items);
});

// Get items submitted to office for admin verification
router.get("/admin/office-submissions", authenticateToken, verifyAdmin, async (req, res) => {
  try {
    const submissions = await ReportFoundItem.find({
      officeSubmissionStatus: 'submitted_to_office'
    }).populate('userId', 'name').sort('-submittedToOfficeAt');
    
    res.json(submissions);
  } catch (error) {
    console.error("Office submissions error:", error);
    res.status(500).json({ message: "Failed to fetch office submissions" });
  }
});

// Admin verify office submission
router.post("/admin/verify-submission/:itemId", authenticateToken, verifyAdmin, async (req, res) => {
  const { approved, notes } = req.body;
  
  try {
    const updateData = {
      officeSubmissionStatus: approved ? 'verified_by_admin' : 'pending_submission',
      status: approved ? 'verified_by_admin' : 'reported',
      verifiedAt: approved ? new Date() : null,
      adminNotes: notes || '',
      officeAddress: approved ? 'TracePoint Office, 123 Main Street, City Center, Contact: +1-234-567-8900' : null
    };
    
    await ReportFoundItem.findByIdAndUpdate(req.params.itemId, updateData);
    
    res.json({ message: approved ? "Item verified and available for claims" : "Item rejected" });
  } catch (error) {
    console.error("Verify submission error:", error);
    res.status(500).json({ message: "Failed to verify submission" });
  }
});

router.delete("/admin/lost-items/:id", authenticateToken, verifyAdmin, async (req, res) => {
  await ReportLost.findByIdAndDelete(req.params.id);
  res.json({ message: "Lost item deleted" });
});

router.delete("/admin/found-items/:id", authenticateToken, verifyAdmin, async (req, res) => {
  await ReportFoundItem.findByIdAndDelete(req.params.id);
  res.json({ message: "Found item deleted" });
});

// Get pending claims for admin verification
router.get("/admin/pending-claims", authenticateToken, verifyAdmin, async (req, res) => {
  try {
    const Message = require("./models/Message");
    const pendingClaims = await Message.find({
      messageType: 'claim_request',
      'claimData.status': 'pending_admin_verification'
    })
    .populate('senderId', 'name')
    .populate('receiverId', 'name')
    .sort('-createdAt');
    
    res.json(pendingClaims);
  } catch (error) {
    console.error("Pending claims error:", error);
    res.status(500).json({ message: "Failed to fetch pending claims" });
  }
});

// Get chat messages for admin review
router.get("/admin/chat/:itemId", authenticateToken, verifyAdmin, async (req, res) => {
  const Message = require("./models/Message");
  try {
    const messages = await Message.find({ itemId: req.params.itemId })
      .populate('senderId', 'name')
      .populate('receiverId', 'name')
      .sort('createdAt');
    res.json(messages);
  } catch (error) {
    console.error("Chat fetch error:", error);
    res.status(500).json({ message: "Failed to fetch chat" });
  }
});

// Admin verify claim (final verification)
router.post("/admin/verify-claim/:messageId", authenticateToken, verifyAdmin, async (req, res) => {
  const { approved } = req.body;
  const Message = require("./models/Message");
  
  try {
    const claimMessage = await Message.findById(req.params.messageId);
    if (!claimMessage) {
      return res.status(404).json({ message: "Claim not found" });
    }

    // Check if already processed
    if (claimMessage.claimData.adminVerifiedAt || claimMessage.claimData.status !== 'pending_admin_verification') {
      return res.status(400).json({ message: "Claim already processed" });
    }

    console.log('Processing claim:', claimMessage);

    // If admin approves, mark both items as verified and ready for collection
    if (approved) {
      // Update the lost item using the lostItemId from claimData
      if (claimMessage.claimData && claimMessage.claimData.lostItemId) {
        console.log('Updating lost item:', claimMessage.claimData.lostItemId);
        const updatedLostItem = await ReportLost.findByIdAndUpdate(claimMessage.claimData.lostItemId, {
          status: 'verified',
          verifiedAt: new Date(),
          collectionStatus: 'ready_for_collection',
          officeAddress: 'TracePoint Office, 123 Main Street, City Center, Contact: +1-234-567-8900'
        }, { new: true });
        console.log('Updated lost item:', updatedLostItem);
      } else {
        // Fallback: try to find lost item by verification code
        const verificationCode = claimMessage.claimData?.verificationCode;
        if (verificationCode) {
          console.log('Finding lost item by verification code:', verificationCode);
          const lostItem = await ReportLost.findOneAndUpdate(
            { verificationCode: verificationCode },
            {
              status: 'verified',
              verifiedAt: new Date(),
              collectionStatus: 'ready_for_collection',
              officeAddress: 'TracePoint Office, 123 Main Street, City Center, Contact: +1-234-567-8900'
            },
            { new: true }
          );
          console.log('Found and updated lost item:', lostItem);
        }
      }
      
      // Also update found item if it exists
      console.log('Updating found item:', claimMessage.itemId);
      const updatedFoundItem = await ReportFoundItem.findByIdAndUpdate(claimMessage.itemId, {
        status: 'verified',
        verifiedAt: new Date(),
        collectionStatus: 'ready_for_collection',
        officeAddress: 'TracePoint Office, 123 Main Street, City Center, Contact: +1-234-567-8900'
      }, { new: true });
      console.log('Updated found item:', updatedFoundItem);
    }

    // Mark original claim as processed
    claimMessage.claimData.status = approved ? 'approved' : 'rejected';
    claimMessage.claimData.adminVerifiedAt = new Date();
    await claimMessage.save();

    // Create response message
    const responseMessage = new Message({
      senderId: claimMessage.receiverId,
      receiverId: claimMessage.senderId,
      itemId: claimMessage.itemId,
      content: approved ? 'Admin has verified your claim. Item is ready for collection at our office.\n\n📍 Collection Address:\nTracePoint Office\n123 Main Street, City Center\n📞 Contact: +1-234-567-8900\n🕒 Hours: Monday - Friday, 9:00 AM - 6:00 PM' : 'Admin has rejected your claim after review.',
      messageType: 'claim_response',
      claimData: {
        status: approved ? 'approved' : 'rejected',
      },
    });
    
    await responseMessage.save();

    res.json({ message: approved ? "Claim verified successfully" : "Claim rejected" });
  } catch (error) {
    console.error("Admin verification error:", error);
    res.status(500).json({ message: "Verification failed: " + error.message });
  }
});

// Get verified items ready for collection
router.get("/admin/collection-items", authenticateToken, verifyAdmin, async (req, res) => {
  try {
    console.log('Fetching collection items...');
    const collectionItems = await ReportLost.find({ 
      status: 'verified',
      collectionStatus: 'ready_for_collection'
    }).populate('userId', 'name');
    
    console.log('Found collection items:', collectionItems.length);
    res.json(collectionItems);
  } catch (error) {
    console.error("Collection items error:", error);
    res.status(500).json({ message: "Failed to get collection items" });
  }
});

// Get verified found items available for claims
router.get("/admin/available-items", authenticateToken, verifyAdmin, async (req, res) => {
  try {
    const availableItems = await ReportFoundItem.find({
      officeSubmissionStatus: 'verified_by_admin',
      status: { $in: ['verified_by_admin', 'claimed'] }
    }).populate('userId', 'name').sort('-verifiedAt');
    
    res.json(availableItems);
  } catch (error) {
    console.error("Available items error:", error);
    res.status(500).json({ message: "Failed to fetch available items" });
  }
});

// Mark item as collected
router.post("/admin/mark-collected/:itemId", authenticateToken, verifyAdmin, async (req, res) => {
  try {
    await ReportLost.findByIdAndUpdate(req.params.itemId, {
      status: 'collected',
      collectionStatus: 'collected',
      collectedAt: new Date()
    });
    
    res.json({ message: "Item marked as collected" });
  } catch (error) {
    console.error("Mark collected error:", error);
    res.status(500).json({ message: "Failed to mark as collected" });
  }
});

// Get statistics
router.get("/admin/statistics", authenticateToken, verifyAdmin, async (req, res) => {
  try {
    const totalLost = await ReportLost.countDocuments();
    const totalFound = await ReportFoundItem.countDocuments();
    const verifiedItems = await ReportLost.countDocuments({ status: 'verified' });
    const collectedItems = await ReportLost.countDocuments({ status: 'collected' });
    const activeItems = await ReportLost.countDocuments({ status: 'active' });
    const readyForCollection = await ReportLost.countDocuments({ collectionStatus: 'ready_for_collection' });
    
    res.json({
      totalLost,
      totalFound,
      verifiedItems,
      collectedItems,
      activeItems,
      readyForCollection,
      successRate: totalLost > 0 ? ((collectedItems / totalLost) * 100).toFixed(1) : 0
    });
  } catch (error) {
    console.error("Statistics error:", error);
    res.status(500).json({ message: "Failed to get statistics" });
  }
});

module.exports = router;
