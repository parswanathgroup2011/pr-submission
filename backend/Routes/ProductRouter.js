const ensureAuthenticated = require('../Middleware/Auth');

const router =require('express').Router();

  
router.get('/',ensureAuthenticated,(req,res) => {
  console.log('---Logged inuser detail----',req.user)
  res.status(200).json([
    {
      name:"mobile",
      price:1000
    },
    {
      name:"tv",
      price:2000
    },
    {
      name:"washing machine",
      price:33
    }
])
});

module.exports= router;