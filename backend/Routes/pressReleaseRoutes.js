// /routes/pressReleaseRoutes.js

const express = require('express');
const router = express.Router();
const { createPressRelease,getAllPressReleases,getPressReleaseById,updatePressRelease,deletePressRelease, getPressReleaseByPrId,getPRHistory,getPRStats,approvePressRelease,rejectPressRelease} =
require('../Controllers/PressReleaseController');
const ensureAuthenticated = require('../Middleware/Auth');
const upload = require('../Middleware/MulterConfig');
const isAdmin = require('../Middleware/isAdmin');

// POST route to create,get,update,delete press release

// CREATE
router.post('/create', ensureAuthenticated, upload.single("image"), createPressRelease);



//Stats and History endpoint
router.get('/stats', ensureAuthenticated,getPRStats);
router.get('/history', ensureAuthenticated,getPRHistory);


// READ
router.get('/',ensureAuthenticated,getAllPressReleases);       // Get all
router.get("/prid/:id",ensureAuthenticated,getPressReleaseByPrId);  //Get Prrelease by pr id   
router.get('/:id',ensureAuthenticated,getPressReleaseById);    // Get one by ID


// UPDATE
router.put('/:id', ensureAuthenticated, upload.single("image"), updatePressRelease);
       // Update by ID

// DELETE
router.delete('/:id',ensureAuthenticated,deletePressRelease);       // Delete by ID
// 🟢 New Route for Admin Approval + Wallet Deduction
router.put('/approve/:id', ensureAuthenticated, isAdmin, approvePressRelease);
// 🔴 New Route for Admin Reject (NO wallet deduction)
router.put('/reject/:id', ensureAuthenticated, isAdmin, rejectPressRelease);


module.exports = router;