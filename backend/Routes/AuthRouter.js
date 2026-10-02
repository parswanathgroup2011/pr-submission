const router = require('express').Router();
const { signupValidation,loginValidation} = require("../Middleware/AuthValidation"); // Make sure this path is correct
const { signup, login,resetPassword,forgotPassword,getUserById,updateUser,changePassword} = require("../Controllers/AuthController"); 
const { getAllUsers, getAllTransactions, updateUserRole } = require("../Controllers/AdminController");
const upload = require("../Middleware/MulterConfig");
const ensureAuthenticated = require("../Middleware/Auth");
const isAdmin = require("../Middleware/isAdmin");
const {
  loginLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
  signupLimiter,
} = require("../Middleware/rateLimiters");

//here make sure evrything is conncted so immport necessary thing here before the code 
//eg. we import the signup page why becuase the signup  page route is conncted  this .



router.get('/users/me', ensureAuthenticated, getUserById);
// This route handles updating profile details like name, email, phone, and ALSO file uploads
router.put('/users/me', ensureAuthenticated, upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "businessLogo", maxCount: 1 },
  { name: "gstImage", maxCount: 1 },
  { name: "panImage", maxCount: 1 }
]), upload.verifyUploadedImages, updateUser);

// NEW ROUTE for changing the password securely
router.put('/users/change-password', ensureAuthenticated, changePassword);



// Use upload middleware for file uploads in signup
router.post("/signup", signupLimiter, upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "businessLogo", maxCount: 1 },
  { name: "gstImage", maxCount: 1 },
  { name: "panImage", maxCount: 1 }
]), upload.verifyUploadedImages, signupValidation, signup);



router.post('/login',loginLimiter,loginValidation,login)
router.post('/forgot-password',forgotPasswordLimiter,forgotPassword)
router.post('/reset-password',resetPasswordLimiter,resetPassword)


// --- Admin-only routes ---
router.get('/admin/users', ensureAuthenticated, isAdmin, getAllUsers); // List all users
router.put('/admin/users/:id/role', ensureAuthenticated, isAdmin, updateUserRole);
router.get('/admin/transactions',ensureAuthenticated,isAdmin,getAllTransactions)



module.exports= router;


