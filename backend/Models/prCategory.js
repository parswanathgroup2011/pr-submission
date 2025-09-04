const mongoose = require('mongoose');

const PRCategorySchema= new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 } // Optional: sort order
}, { timestamps: true });

module.exports = mongoose.model('prcategories',PRCategorySchema );
