const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PressReleaseSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  prId: { type: String, unique: true, required: true }, // 👈 Add this line


  // Step 1: Press Info

  title: { type: String, required: true },
  summary: { type: String },
  content: { type: String, required: true },
  image: { type: String,default:null},
  quoteDescription: { type: String },
  city: { type: String },
  subMember: { type: String },

  // Step 2: Tags/Scheduler
  tags: [{ type: String }],
  scheduledAt: { type: Date }, // If you want scheduling

  status: {
    type: String,
    enum: ['pending', 'published', 'rejected'],
    default: 'pending'
  }
,  

  // Step 3: Plan Selection
  selectedPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'plans', required: true },
  selectedCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'prcategories' },

}, { timestamps: true });

module.exports = mongoose.model('pressreleases', PressReleaseSchema);


