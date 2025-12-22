const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ReportLostItem",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'claim_request', 'claim_response'],
    default: 'text',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  claimData: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'admin_verified', 'admin_rejected', 'pending_admin_verification'],
    },
    verificationCode: String,
    verificationImage: String,
    lostItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReportLostItem",
    },
    lostItemName: String,
    foundItemName: String,
    matchScore: Number,
    matchBreakdown: {
      color: Number,
      condition: Number,
      accessories: Number,
      marks: Number,
      description: Number
    },
    conflicts: [String],
    lostDetails: {
      colors: [String],
      condition: String,
      accessories: [String],
      marks: [String],
      size: String
    },
    foundDetails: {
      colors: [String],
      condition: String,
      accessories: [String],
      marks: [String],
      size: String
    },
    requiresReview: Boolean,
    adminVerifiedAt: Date,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Message", messageSchema);