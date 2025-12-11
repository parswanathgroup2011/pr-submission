const express= require("express");
const router = express.Router();

const auth = require("../Middleware/Auth");

const {
  getPendingTopups,
  approveTopup,
  rejectTopup
} = require("../Controllers/ManualTopupControllerS");
const isAdmin = require("../Middleware/isAdmin");

// Get all pending top-up requests
router.get("/manual-topups", auth,isAdmin, getPendingTopups);

// Approve a top-up request
router.put("/manual-topups/approve/:id", auth,isAdmin, approveTopup);

// Reject a top-up request
router.put("/manual-topups/reject/:id", auth, isAdmin,rejectTopup);

module.exports = router;