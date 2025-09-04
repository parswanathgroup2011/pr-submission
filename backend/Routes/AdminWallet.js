const express = require('express');
const router= express.Router();
const User = require('../Models/Users');
const Wallet = require('../Models/Wallet');

//Get all user info with wallet info
router.get("/user-wallet", async(req,res) => {
  try{
    const users = await User.find({},"clientName email mobileNumber role");

    //attach walletbalance for each user

    const data = await Promise.all(
      users.map(async (user) => {
        const wallet = await Wallet.findOne({userId: user._id});
        return{
          _id:user._id,
          name: user.clientName,
          email : user.email,
          mobile: user.mobileNumber,
          role: user.role,
          walletBalance: wallet ? wallet.balance: 0,
        };
      })
    )

    // ✅ Send response back to frontend
    res.json(data);


  }catch(error){
    console.error(error);
    res.status(500).json({message:"Server error"})
  }
});

module.exports= router;