const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  department: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  graduationYear: { type: Number, required: true },
  degree: { type: String, required: true },
  currentJobTitle: { type: String },
  companyName: { type: String },
  contactNumber: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

alumniSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("Alumni", alumniSchema);