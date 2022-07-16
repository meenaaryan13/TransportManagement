const mongoose=require("mongoose");
const OtpVerificationSchema=mongoose.Schema({
  userId:{type:String,require:true},
  otp:{type:Number,require:true},
  createAt:Date,
  expiresAt:Date
});

const OtpVerification=mongoose.model("OtpVerification",OtpVerificationSchema);
module.exports=OtpVerification;