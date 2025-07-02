const mongoose = require('mongoose');

const reportLostSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    image: { type: String, required: true }, 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    founderName: { type: String },
    founderContact: { type: String },
  },
  { timestamps: true } 
);

module.exports = mongoose.model('ReportLostItem', reportLostSchema);
