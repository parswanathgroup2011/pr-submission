const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlanSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },

  credits: { type: Number, required: true },
  tat: { type: String }, // Turnaround Time
  disclaimer: { type: String },
  backlink: { type: String },
  
  // Support multiple languages
  language: [{ type: String }], // Changed to array

  highlights: [{ type: String }], // e.g. ["NDTV", "Aaj Tak", "Ahmedabad Mirror"]

  websiteCountText: { type: String }  ,

  // NEW: Distinguish between single-channel and group plan
  type: {
    type: String,
    enum: ['single','group'],
    default: 'single'
  }

}, { timestamps: true });



module.exports = mongoose.model('plans', PlanSchema); // ✅ This line is important