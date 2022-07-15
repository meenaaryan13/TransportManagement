var {Schema,model} = require("mongoose");

const Student_Ragistartion_Schema = new Schema({
  FirstName:{type:String,require:true},
  LastName:{type:String,require:true},
  MobileNumber:{type:Number,require:true},
  FatherName:{type:String,require:true},
  Email:{type:String,require:true,unique:true},
  password: { type: String, require: true },
  Branch:{type:String, require:true},
  Year:{type:Date,require:true},
  Track:{type:String,require:true},
  createdAt:{type:Date, default:Date.now()},
  // timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },

  // username: { type: String,unique:true,require :true },
});

var data = model('Student_Ragistration', Student_Ragistartion_Schema);

module.exports=data;
