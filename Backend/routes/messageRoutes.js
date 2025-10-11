const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const {
  getMessages,
  sendMessage,
  sendClaimRequest,
  respondToClaimRequest,
  getChatRooms,
  markAsRead,
} = require("../controllers/messageController");

const router = express.Router();

// Get messages for a specific item
router.get("/messages/:itemId", authenticateToken, getMessages);

// Send a new message
router.post("/messages", authenticateToken, sendMessage);

// Send claim request
router.post("/messages/claim-request", authenticateToken, sendClaimRequest);

// Respond to claim request
router.post("/messages/claim-response", authenticateToken, respondToClaimRequest);

// Get chat rooms for user
router.get("/chat-rooms", authenticateToken, getChatRooms);

// Mark messages as read
router.post("/messages/mark-read", authenticateToken, markAsRead);

module.exports = router;