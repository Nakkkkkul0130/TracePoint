const express = require("express");
const authenticateToken = require("./authMiddleware");
const Message = require("./Message");
const FoundItem = require("./FoundItem"); 
const User = require("./User");

const router = express.Router();


router.get("/messages/:itemId", authenticateToken, async (req, res) => {
  const { itemId } = req.params;
  try {
    const messages = await Message.find({ itemId })
      .sort("timestamp")
      .lean();
    res.json(messages);
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});


router.post("/messages", authenticateToken, async (req, res) => {
  const { itemId, receiverId, content } = req.body;
  if (!itemId || !receiverId || !content) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const message = new Message({
      senderId: req.user.id,
      receiverId,
      itemId,
      content,
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error(" Failed to send message:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});


router.get("/chat-rooms", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .populate("senderId", "name")
      .populate("receiverId", "name")
      .populate({
        path: "itemId",
        select: "itemName",
      })
      .sort("-timestamp")
      .lean();

    const uniqueChats = {};

    messages.forEach((msg) => {
      const isSender = msg.senderId._id.toString() === userId;
      const otherUser = isSender ? msg.receiverId : msg.senderId;
      const key = `${otherUser._id}_${msg.itemId._id}`;

      if (!uniqueChats[key]) {
        uniqueChats[key] = {
          itemId: msg.itemId._id,
          itemName: msg.itemId?.itemName || "Unknown item",
          otherUserId: otherUser._id,
          otherUserName: otherUser?.name || "Unknown User",
          lastMessage: msg.content,
          timestamp: msg.timestamp,
        };
      }
    });

    res.json(Object.values(uniqueChats));
  } catch (error) {
    console.error(" Failed to fetch chat rooms:", error);
    res.status(500).json({ message: "Failed to fetch chat rooms" });
  }
});

module.exports = router;
