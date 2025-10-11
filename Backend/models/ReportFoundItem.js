const mongoose = require('mongoose');

const reportFoundItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  foundDate: { type: Date, required: true },
  contactInfo: { type: String, required: true },
  image: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reporterName: { type: String, required: true },
  status: { type: String, enum: ['reported', 'submitted_to_office', 'verified_by_admin', 'claimed', 'collected'], default: 'reported' },
  submittedToOfficeAt: Date,
  verifiedAt: Date,
  collectedAt: Date,
  officeSubmissionStatus: {
    type: String,
    enum: ['pending_submission', 'submitted_to_office', 'verified_by_admin'],
    default: 'pending_submission',
  },
  adminNotes: String,
  officeAddress: String,
}, { timestamps: true });

module.exports = mongoose.model('ReportFoundItem', reportFoundItemSchema);