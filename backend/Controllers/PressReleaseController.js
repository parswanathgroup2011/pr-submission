const PressRelease = require("../Models/pressRelease");
const Plan = require("../Models/plan");
const PRCategory = require("../Models/prCategory");
const Counter = require("../Models/counterModel");
const Wallet = require('../Models/Wallet');
const WalletTransaction = require('../Models/WalletTransactionSchema');
const { debitWallet } = require('../Service/walletService')



// 🟢 Create Press Release
const createPressRelease = async (req, res) => {
  try {
    const {
      
      title,
      summary,
      content,
      quoteDescription,
      city,
      subMember,
      tags,
      scheduledAt,
      selectedPlan,
      selectedCategory,
    } = req.body;
    const userId = req.user._id;

    if (!title || !content || !selectedPlan) {
      return res.status(400).json({ error: "Title, Content, and Plan are required" });
    }

    const plan = await Plan.findById(selectedPlan);
    if (!plan) return res.status(400).json({ error: "Selected Plan doesn't exist" });

    if (selectedCategory) {
      const category = await PRCategory.findById(selectedCategory);
      if (!category) return res.status(400).json({ error: "Selected Category doesn't exist" });
    }

    // 🔢 Generate PR ID
    const counter = await Counter.findByIdAndUpdate(
      { _id: "pressRelease" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const prId = `PR-1011${counter.seq.toString().padStart(5, "0")}`;

    // ✅ Use req.file.path for uploaded image
    const imagePath = req.file ? req.file.path : null;

    const newPressRelease = new PressRelease({
      prId,
      userId,
      title,
      summary,
      content,
      image: imagePath,
      quoteDescription,
      city,
      subMember,
      tags,
      scheduledAt,
      selectedPlan,
      selectedCategory,
      status: "pending",
    });

    await newPressRelease.save();
    res.status(201).json({ message: "Press Release Created Successfully", pressRelease: newPressRelease });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// 🟢 Get All Press Releases
const getAllPressReleases = async (req, res) => {
  try {
    const pressReleases = await PressRelease.find()
      .populate("userId", "name email")
      .populate("selectedPlan", "name")
      .populate("selectedCategory", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(pressReleases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🟢 Get PR by Mongo ID
const getPressReleaseById = async (req, res) => {
  try {
    const pressRelease = await PressRelease.findById(req.params.id)
      .populate("userId", "name email")
      .populate("selectedPlan", "name description")
      .populate("selectedCategory", "name");

    if (!pressRelease) return res.status(404).json({ error: "Press release not found" });

    res.status(200).json(pressRelease);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🟢 Get PR by custom prId (e.g. PR-101100001)
const getPressReleaseByPrId = async (req, res) => {
  try {
    const pressRelease = await PressRelease.findOne({ prId: req.params.id })
      .populate("userId", "name email")
      .populate("selectedPlan", "name description")
      .populate("selectedCategory", "name");

    if (!pressRelease) return res.status(404).json({ error: "Press release not found" });

    res.status(200).json(pressRelease);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🟡 Update Press Release
const updatePressRelease = async (req, res) => {
  try {

    console.log("📝 Body fields:", req.body);
    console.log("📸 File:", req.file); 
    const {
      title,
      summary,
      content,
      quoteDescription,
      city,
      subMember,
      tags,
      scheduledAt,
      selectedPlan,
      selectedCategory,
      status,
    } = req.body;

    const pressRelease = await PressRelease.findById(req.params.id);
    if (!pressRelease) return res.status(404).json({ error: "Press release not found" });

    if (['published', 'rejected'].includes(pressRelease.status)) {
      return res.status(403).json({ error: "You can only edit press release in Draft or Pending Status" });
    }

    // Validate plan and category
    if (selectedPlan) {
      const plan = await Plan.findById(selectedPlan);
      if (!plan) return res.status(404).json({ error: "Selected Plan doesn't exist" });
    }

    if (selectedCategory) {
      const category = await PRCategory.findById(selectedCategory);
      if (!category) return res.status(404).json({ error: "Selected Category doesn't exist" });
    }

    // ✅ Update fields
    pressRelease.title = title || pressRelease.title;
    pressRelease.summary = summary || pressRelease.summary;
    pressRelease.content = content || pressRelease.content;

    // ✅ Handle new image from Multer
    if (req.file) {
      pressRelease.image = req.file.path;   // e.g. "uploads/filename.png"
    }

    pressRelease.quoteDescription = quoteDescription || pressRelease.quoteDescription;
    pressRelease.city = city || pressRelease.city;
    pressRelease.subMember = subMember || pressRelease.subMember;
    pressRelease.tags = tags || pressRelease.tags;
    pressRelease.scheduledAt = scheduledAt || pressRelease.scheduledAt;
    pressRelease.selectedPlan = selectedPlan || pressRelease.selectedPlan;
    pressRelease.selectedCategory = selectedCategory || pressRelease.selectedCategory;
    pressRelease.status = status || pressRelease.status;

    await pressRelease.save();
    res.status(200).json({ message: "Press Release Updated Successfully", pressRelease });
  } catch (error) {
    console.error("❌ Error in updatePressRelease:", error);
    res.status(500).json({ error: "Server error" });
  }
};





// 🔴 Delete PR
const deletePressRelease = async (req, res) => {
  try {
    const pressRelease = await PressRelease.findById(req.params.id);

    if (!pressRelease) {
      return res.status(404).json({ error: "Press Release not found" });
    }

    // 🚫 Prevent deleting if status is published or rejected
    if (['published', 'rejected'].includes(pressRelease.status)) {
      return res.status(403).json({ error: "You can only delete press releases in Draft or Pending status" });
    }

    await PressRelease.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Press Release Deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
    
  }
};

// 📊 PR Stats for dashboard
const getPRStats = async (req, res) => {
  try {
    let filter = {};

    console.log("User in stats route:", req.user);

    // If user is NOT admin → filter by their own PRs
    if (req.user.role !== "admin") {
      filter.userId = req.user._id;
    }

    console.log("Filter applied:", filter);

    const total = await PressRelease.countDocuments(filter);
    const pending = await PressRelease.countDocuments({ ...filter, status: "pending" });
    const published = await PressRelease.countDocuments({ ...filter, status: "published" });
    const rejected = await PressRelease.countDocuments({ ...filter, status: "rejected" });

    res.status(200).json({ 
      totalPR: total, 
      pendingPR: pending, 
      publishedPR: published, 
      rejectedPR: rejected 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// 📜 PR History for user dashboard (CORRECTED)
const getPRHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const pressReleases = await PressRelease.find({ userId })
      .populate('userId', 'clientName')   
      .populate("selectedPlan", "name credits")
      .populate("selectedCategory", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalPages = Math.ceil(await PressRelease.countDocuments({ userId }) / limit);

    // FIX: Wrap the array in an object with the key "pressRelease"
    res.status(200).json({ 
        pressRelease: pressReleases,
        page: page,
        totalPages: totalPages
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const approvePressRelease = async (req, res) => {
  try {
    const { id } = req.params;

    const pressRelease = await PressRelease.findById(id).populate('selectedPlan');
    if (!pressRelease) {
      return res.status(404).json({ error: "PR not found" });
    }

    if (pressRelease.status !== 'pending') {
      return res.status(400).json({ error: 'PR is already processed' });
    }

    const userId = pressRelease.userId;
    const plan = pressRelease.selectedPlan;

    if (!plan || !plan.credits) {
      return res.status(400).json({ error: "Selected plan is invalid" });
    }

    // ✅ DEBIT wallet — this already updates wallet + logs transaction
    await debitWallet(userId, plan.credits, `Credit used for PR ${pressRelease.prId}`);

    // ✅ Approve PR after successful wallet deduction
    pressRelease.status = "published";
    await pressRelease.save();

    res.status(200).json({
      message: 'PR approved and wallet debited successfully',
      pressRelease
    });

  } catch (error) {
    console.error(error);

    // Return custom message if the debitWallet throws "Insufficient wallet balance"
   if (error.message === "Insufficient wallet balance") {
  return res.status(400).json({ error: error.message });
}


    res.status(500).json({ error: 'Server error during PR approval' });
  }
};


module.exports = {
  createPressRelease,
  getAllPressReleases,
  getPressReleaseById,
  getPressReleaseByPrId,
  updatePressRelease,
  deletePressRelease,
  getPRStats,
  getPRHistory,
  approvePressRelease
};
