const mongoose = require("mongoose");

const manualTopSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "users", 
    required: true 
  },

  amount: { 
    type: Number, 
    required: true 
  },

  screenshot: { 
    type: String, 
    required: true 
  },

  status: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending"
},


  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("ManualTopUp", manualTopSchema);
