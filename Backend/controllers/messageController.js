const Message = require("../models/Message");
const ReportLostItem = require("../models/ReportLostItem");
const ReportFoundItem = require("../models/ReportFoundItem");
const User = require("../models/User");
const ItemVerification = require("../utils/itemVerification");

// Get messages for a specific item
const getMessages = async (req, res) => {
  const { itemId } = req.params;
  try {
    const messages = await Message.find({ itemId })
      .populate('senderId', 'name')
      .populate('receiverId', 'name')
      .sort('createdAt')
      .lean();
    res.json(messages);
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

// Send a new message
const sendMessage = async (req, res) => {
  const { itemId, receiverId, content, messageType = 'text' } = req.body;
  
  if (!itemId || !receiverId || !content) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const message = new Message({
      senderId: req.user.id,
      receiverId,
      itemId,
      content,
      messageType,
    });
    
    await message.save();
    
    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name')
      .populate('receiverId', 'name');
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Failed to send message:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

// Send claim request with enhanced verification
const sendClaimRequest = async (req, res) => {
  const { itemId, receiverId, verificationCode } = req.body;
  
  try {
    // Step 1: Get the found item details
    const foundItem = await ReportFoundItem.findById(itemId);
    if (!foundItem) {
      return res.status(404).json({ message: "Found item not found" });
    }
    
    // Step 2: Find the user's lost item with matching verification code
    const userLostItem = await ReportLostItem.findOne({
      userId: req.user.id,
      verificationCode: verificationCode,
      status: 'active'
    });
    
    if (!userLostItem) {
      return res.status(400).json({ message: "Invalid verification code or no matching lost item found" });
    }
    
    // Step 3: Enhanced item matching verification
    const matchResult = ItemVerification.verifyItemMatch(userLostItem, foundItem);
    
    if (!matchResult.isMatch) {
      // Log suspicious activity
      console.log('Suspicious claim attempt:', {
        userId: req.user.id,
        lostItem: userLostItem.itemName,
        foundItem: foundItem.itemName,
        score: matchResult.score,
        conflicts: matchResult.conflicts
      });
      
      return res.status(400).json({ 
        message: "Items don't appear to match",
        details: {
          yourLostItem: userLostItem.itemName,
          foundItem: foundItem.itemName,
          matchScore: matchResult.score,
          conflicts: matchResult.conflicts,
          reason: matchResult.reason
        }
      });
    }
    
    // Step 4: Check if verification code already used
    const existingClaim = await Message.findOne({
      'claimData.verificationCode': verificationCode,
      'claimData.status': { $in: ['pending_admin_verification', 'approved'] }
    });
    
    if (existingClaim) {
      return res.status(400).json({ message: "This verification code has already been used for a claim" });
    }
    
    // Step 5: Create enhanced claim message
    const message = new Message({
      senderId: req.user.id,
      receiverId,
      itemId,
      content: `I believe this is my item. My lost item: ${userLostItem.itemName}. Match confidence: ${matchResult.score}%`,
      messageType: 'claim_request',
      claimData: {
        status: 'pending_admin_verification',
        verificationCode: verificationCode,
        lostItemId: userLostItem._id,
        lostItemName: userLostItem.itemName,
        foundItemName: foundItem.itemName,
        matchScore: matchResult.score,
        matchBreakdown: matchResult.breakdown,
        conflicts: matchResult.conflicts,
        lostDetails: matchResult.lostDetails,
        foundDetails: matchResult.foundDetails,
        requiresReview: matchResult.score < 80
      },
    });
    
    await message.save();
    
    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name')
      .populate('receiverId', 'name');
    
    res.status(201).json({
      message: populatedMessage,
      matchDetails: {
        score: matchResult.score,
        breakdown: matchResult.breakdown,
        confidence: matchResult.score >= 80 ? 'High' : matchResult.score >= 60 ? 'Medium' : 'Low'
      }
    });
  } catch (error) {
    console.error("Failed to send claim request:", error);
    res.status(500).json({ message: "Failed to send claim request" });
  }
};

// This function is now deprecated - claims go directly to admin
const respondToClaimRequest = async (req, res) => {
  res.status(400).json({ message: "Claims are now verified by admin only" });
};

// Get chat rooms for user
const getChatRooms = async (req, res) => {
  try {
    const userId = req.user.id;
    const ReportFoundItem = require('../models/ReportFoundItem');

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .populate("senderId", "name")
      .populate("receiverId", "name")
      .sort("-createdAt")
      .lean();

    const uniqueChats = {};

    for (const msg of messages) {
      // Skip messages with null references
      if (!msg.senderId || !msg.receiverId) {
        continue;
      }

      const isSender = msg.senderId._id.toString() === userId;
      const otherUser = isSender ? msg.receiverId : msg.senderId;
      
      // Skip if otherUser is null
      if (!otherUser || !otherUser._id) {
        continue;
      }

      // Get item info from both lost and found items
      let itemInfo = null;
      try {
        itemInfo = await ReportLostItem.findById(msg.itemId).lean();
        if (!itemInfo) {
          itemInfo = await ReportFoundItem.findById(msg.itemId).lean();
        }
      } catch (err) {
        console.log('Item not found:', msg.itemId);
        continue;
      }

      if (!itemInfo) continue;

      const key = `${otherUser._id}_${msg.itemId}`;

      if (!uniqueChats[key]) {
        uniqueChats[key] = {
          itemId: msg.itemId,
          itemName: itemInfo?.itemName || "Unknown item",
          itemStatus: itemInfo?.status || "active",
          otherUserId: otherUser._id,
          otherUserName: otherUser?.name || "Unknown User",
          lastMessage: msg.content,
          lastMessageType: msg.messageType,
          timestamp: msg.createdAt,
          unreadCount: 0,
        };
      }
    }

    // Count unread messages
    for (const chat of Object.values(uniqueChats)) {
      const unreadCount = await Message.countDocuments({
        itemId: chat.itemId,
        receiverId: userId,
        senderId: chat.otherUserId,
        isRead: false,
      });
      chat.unreadCount = unreadCount;
    }

    res.json(Object.values(uniqueChats));
  } catch (error) {
    console.error("Failed to fetch chat rooms:", error);
    res.status(500).json({ message: "Failed to fetch chat rooms" });
  }
};

// Mark messages as read
const markAsRead = async (req, res) => {
  const { itemId, otherUserId } = req.body;
  
  try {
    await Message.updateMany(
      {
        itemId,
        senderId: otherUserId,
        receiverId: req.user.id,
        isRead: false,
      },
      { isRead: true }
    );
    
    res.json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Failed to mark messages as read:", error);
    res.status(500).json({ message: "Failed to mark messages as read" });
  }
};

module.exports = {
  getMessages,
  sendMessage,
  sendClaimRequest,
  respondToClaimRequest,
  getChatRooms,
  markAsRead,
};