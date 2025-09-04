const Plan = require("../Models/plan");

// Create a plan (Admin only)
const createPlan = async (req, res) => {
  try {
    const {
      name,
      description,
      credits,
      tat,
      disclaimer,
      backlink,
      language,
      highlights,
      websiteCountText,
      type
      
    } = req.body;

    // Validate required fields
    if (!name || credits === undefined) {
      return res.status(400).json({ error: "Name and credits are required" });
    }

    // Check for duplicate name
    const existingPlan = await Plan.findOne({ name });
    if (existingPlan) {
      return res.status(400).json({ error: "Plan name already exists" });
    }

    const newPlan = new Plan({
      name,
      description,
      credits,
      tat,
      disclaimer,
      backlink,
      language,
      highlights,
      websiteCountText,
      type,
      
    });

    await newPlan.save();
    res.status(201).json({ message: "Plan created successfully", plan: newPlan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all plans (for client dropdown or admin list)
const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ name: 1 });
    res.status(200).json(plans);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};



// Get plan by ID (for showing details after selection)
const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }
    res.status(200).json(plan);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update plan (Admin only)
const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    const {
      name,
      description,
      credits,
      tat,
      disclaimer,
      backlink,
      language,
      highlights,
      websiteCountText,
      type
    } = req.body;

    plan.name = name || plan.name;
    plan.description = description || plan.description;
    plan.credits = credits !== undefined ? credits : plan.credits;
    plan.tat = tat || plan.tat;
    plan.disclaimer = disclaimer || plan.disclaimer;
    plan.backlink = backlink || plan.backlink;
    plan.language = language || plan.language;
    plan.type = type || plan.type;
    plan.highlights = highlights || plan.highlights;
    plan.websiteCountText = websiteCountText || plan.websiteCountText;

    await plan.save();
    res.status(200).json({ message: "Plan updated successfully", plan });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete plan (Admin only)
const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }
    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan,
};
