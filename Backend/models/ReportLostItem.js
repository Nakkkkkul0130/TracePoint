const mongoose = require("mongoose");

const reportLostItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  itemName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'claimed', 'verified', 'collected', 'resolved'],
    default: 'active',
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  claimedAt: Date,
  verifiedAt: Date,
  collectedAt: Date,
  collectionStatus: {
    type: String,
    enum: ['pending', 'ready_for_collection', 'collected'],
    default: 'pending',
  },
  officeAddress: String,
  verificationCode: {
    type: String,
    unique: true,
    sparse: true,
  },
}, {
  timestamps: true,
});

// Generate verification code before saving
reportLostItemSchema.pre('save', function(next) {
  if (this.isNew) {
    this.verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

module.exports = mongoose.model("ReportLostItem", reportLostItemSchema);