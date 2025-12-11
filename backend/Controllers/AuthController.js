const UsersModel= require("../Models/Users");
const bcrypt = require('bcryptjs');

const jwt= require('jsonwebtoken');
const nodemailer= require('nodemailer')



const signup=async(req,res) =>{
  try{
      const{clientName, email, password, clientType, companyName, mobileNumber, address, 
      state,city, pincode, website, gstNumber, panNumber, ifscCode, bankName, branchName, 
      micrCode, branchCode, authorisedName, accountNumber} =req.body;
                                                                                       
    const user=await UsersModel.findOne({email});

    if(user){
      return res.status(409)
      .json({message:"User with this email already exists, you can login",success:false})
    }

    const userModel=new UsersModel({clientName,email,password,clientType,companyName,mobileNumber
      ,address,state,city,pincode,website,gstNumber,panNumber,
      ifscCode,bankName,branchName,micrCode,branchCode,authorisedName,accountNumber,
      profileImage: req.files["profileImage"] ? req.files["profileImage"][0].path : null,
      businessLogo: req.files["businessLogo"] ? req.files["businessLogo"][0].path : null,
      gstImage: req.files["gstImage"] ? req.files["gstImage"][0].path : null,
      panImage: req.files["panImage"] ? req.files["panImage"][0].path : null
    });
    
    userModel.password=await bcrypt.hash(password,10);
    await userModel.save();
    res.status(201)
    .json({
      message:"Signup success fully",
      success:true
    
    })

  }catch (err){
    console.log(err);
    res.status(500)
    .json({
      message:"Internal server error",
      success:false
    })

  }
}



const getUserById = async(req,res) => {
  try{
    const user = await UsersModel.findById(req.user._id).select("-password -resetOtp -resetOtpExpire");
    if(!user){
      return res.status(404).json({error:"User not found"})
    }
    res.status(200).json({user,success:true})

  }catch(error){
    console.log(error);
    res.status(500).json({error:"Server Error"})
  }
}

// In your Users Controller file

const updateUser = async(req,res) => {
  try {
    const { clientName, email, clientType, companyName, mobileNumber, address, 
            state, city, pincode, website, gstNumber, panNumber, ifscCode, 
            bankName, branchName, micrCode, branchCode, authorisedName, accountNumber } = req.body;

    const user = await UsersModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // --- CRITICAL: Check if email is being changed and if it's available ---
    if (email && email !== user.email) {
      const existingUser = await UsersModel.findOne({ email: email });
      if (existingUser) {
        return res.status(409).json({ message: "This email is already in use by another account.", success: false });
      }
      user.email = email;
    }

    // --- CORRECT WAY TO UPDATE ---
    // This allows you to set fields to empty strings or 0 if needed.
    if (clientName !== undefined) user.clientName = clientName;
    if (clientType !== undefined) user.clientType = clientType;
    if (companyName !== undefined) user.companyName = companyName;
    if (mobileNumber !== undefined) user.mobileNumber = mobileNumber;
    // ... add all other text fields here in the same format ...
    if (address !== undefined) user.address = address;
    if (state !== undefined) user.state = state;
    if (city !== undefined) user.city = city;
    if (pincode !== undefined) user.pincode = pincode;
    if (website !== undefined) user.website = website;
    if (gstNumber !== undefined) user.gstNumber = gstNumber;
    if (panNumber !== undefined) user.panNumber = panNumber;
    if (ifscCode !== undefined) user.ifscCode = ifscCode;
    if (bankName !== undefined) user.bankName = bankName;
    if (branchName !== undefined) user.branchName = branchName;
    if (micrCode !== undefined) user.micrCode = micrCode;
    if (branchCode !== undefined) user.branchCode = branchCode;
    if (authorisedName !== undefined) user.authorisedName = authorisedName;
    if (accountNumber !== undefined) user.accountNumber = accountNumber;

    // Handle file uploads
    if (req.files) {
      if (req.files["profileImage"]) user.profileImage = req.files["profileImage"][0].path;
      if (req.files["businessLogo"]) user.businessLogo = req.files["businessLogo"][0].path;
      if(req.files["gstImage"]) user.gstImage = req.files["gstImage"][0].path;
      if(req.files["panImage"]) user.panImage = req.files["panImage"][0].path;
      
    }

    await user.save();
    
    res.status(200).json({ message: "Profile updated successfully", success: true });

  } catch(error) {
    console.log(error);
    res.status(500).json({ error: "Server Error", success: false });
  }
}

// Add this new function to your Users Controller file

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Find the user but ensure we get the password field for comparison
    const user = await UsersModel.findById(userId).select('+password');

    if (!user) {
      return res.status(404).json({ message: "User not found.", success: false });
    }

    // Check if the provided current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect current password.", success: false });
    }

    // Hash the new password and save it
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password changed successfully.", success: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};


const login=async(req,res) =>{

  try{
    const {email,password} =req.body;
    const user=await UsersModel.findOne({email});
    const errorMessage="Auth failed,email or password is wrong"
    if(!user){
      return res.status(403)
      .json({message:errorMessage,success:false})
    }

    const isPassEqual=await bcrypt.compare(password,user.password);
    if(!isPassEqual){
      return res.status(403)
      .json({message:errorMessage,success:false})
    }
    const JwtToken= jwt.sign({email:user.email, _id:user._id,role: user.role},
      process.env.JWT_SECRET,
      {expiresIn:'24h'}
    )                                                                                                                                                                                                                                                                                                                                                                    
    res.status(200)
    .json({
      message:"Login successfully",
      success:true,
      email,
      token:JwtToken,
      name:user.clientName,
      role: user.role
    
    })



  }catch (err){
    res.status(500)
    .json({
      message:"Internal server error",
      success:false
    })

  }
}


const forgotPassword = async(req,res) =>{
  try{
    const{email}=req.body;
    const user =await UsersModel.findOne({email});

    if(!user){
      return res.status(404).json({message:"User not found",success:false}); 
    }


  // Generate 6-digit OTP //Math.random gives between 0 to 1
  const otp = Math.floor(100000 + Math.random() * 900000).toString();


// save otp and expiration below line come from database 

  user.resetOtp=otp;
  user.resetOtpExpire=Date.now() +10*60*1000;
  await user.save();

  //send Email:

  const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
      user:process.env.EMAIL_USER,
      pass:process.env.EMAIL_PASS,
    }
  });

  const mailOptions ={
    from:"yvyas9646@gmail.com",
    to:user.email,
    subject:"OTP for password Reset",
    html:`<h3>Your OTP is:${otp}</h3><p>This OTP is valid for 10 minutes</p>`
  };

  await transporter.sendMail(mailOptions);
  res.status(200).json({message:"OTP sent to your email",success:true});


  }catch(error){
    console.log(error)
    return res.status(500).json({message:"something went wrong",success:false})
  }
}



const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await UsersModel.findOne({ email });

    if (!user || user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }

    if (user.resetOtpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }
    
    
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear OTP fields
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};



module.exports={
  signup,
  login,
  getUserById,
  updateUser,
  forgotPassword,
  resetPassword,
  changePassword
}


