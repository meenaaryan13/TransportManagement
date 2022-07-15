var { Schema, model } = require("mongoose");

const Employe_Ragistartion_Schema = new Schema({
  UserName:{type:String,require:true},
  MobileNumber:{type: Number, require: true }, //
  Email: { type: String, require: true, unique: true }, //
  Password: { type: String, require: true }, //
  Post:{type:Stirng,require:true},

  createdAt: { type: Date, default: Date.now() },
  // timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },

  // username: { type: String,unique:true,require :true },
});

var data = model("Employe_Ragistration", Employe_Ragistartion_Schema);

module.exports = data;
