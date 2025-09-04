const router = require('express').Router();
const { signupValidation,loginValidation} = require("../Middleware/AuthValidation"); // Make sure this path is correct
const { signup, login,resetPassword,forgotPassword,getUserById,updateUser,changePassword} = require("../Controllers/AuthController"); 
const { getAllUsers, getAllTransactions } = require("../Controllers/AdminController");
const upload = require("../Middleware/MulterConfig");
const ensureAuthenticated = require("../Middleware/Auth");
const isAdmin = require("../Middleware/isAdmin");

//here make sure evrything is conncted so immport necessary thing here before the code 
//eg. we import the signup page why becuase the signup  page route is conncted  this .



router.get('/users/me', ensureAuthenticated, getUserById);
// This route handles updating profile details like name, email, phone, and ALSO file uploads
router.put('/users/me', ensureAuthenticated, upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "businessLogo", maxCount: 1 },
  { name: "gstImage", maxCount: 1 },
  { name: "panImage", maxCount: 1 }
]), updateUser);

// NEW ROUTE for changing the password securely
router.put('/users/change-password', ensureAuthenticated, changePassword);



// Use upload middleware for file uploads in signup
router.post("/signup", upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "businessLogo", maxCount: 1 },
  { name: "gstImage", maxCount: 1 },
  { name: "panImage", maxCount: 1 }
]), signupValidation, signup);



router.post('/login',loginValidation,login)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password',resetPassword)


// --- Admin-only routes ---
router.get('/admin/users', ensureAuthenticated, isAdmin, getAllUsers); // List all users
router.get('/admin/transactions',ensureAuthenticated,isAdmin,getAllTransactions)



module.exports= router;


