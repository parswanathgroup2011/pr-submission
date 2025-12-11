const express = require("express");
const router = express.Router();

const upload = require("../Middleware/MulterConfig")
const { createManualTopup,getPendingTopups,approveTopup,rejectTopup} = require("../Controllers/ManualTopupControllerS");
const auth = require("../Middleware/Auth");


router.post(
  "/manual-topup",
  auth,
  upload.single("screenshot"),   
  createManualTopup
);

router.post

module.exports = router;
