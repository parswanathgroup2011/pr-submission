const mongoose=require('mongoose');

const Schema= mongoose.Schema;

const UserSchema=new Schema({
  clientName:{type: String,required:true},
  clientType:{type:String},
  companyName:{type:String},
  email:{type:String,required:true,unique:true,index:true},
  password:{type:String,required:true},
  mobileNumber:{type:String,required:true,unique:true},
  address:{type:String},
  state:{type:String},
  city:{type:String},
  pincode:{type:String},
  website:{type:String},
  profileImage:{type:String},
  businessLogo:{type:String},
  gstNumber:{type:String},
  gstImage:{type:String},
  panNumber:{type:String},
  panImage:{type:String},
  ifscCode:{type:String},
  bankName:{type:String},
  branchName:{type:String},
  micrCode:{type:String},
  branchCode:{type:String},
  authorisedName:{type:String},
  accountNumber:{type:String},


   // 👇 OTP Fields for Forgot Password
   resetOtp: { type: String },
   resetOtpExpire: { type: Date },
  role: { type: String, default: "user" }  
   
},{timestamps:true},);

const UsersModel=mongoose.model('users',UserSchema);

module.exports=UsersModel;

