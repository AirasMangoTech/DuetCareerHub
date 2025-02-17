const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  qualification: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'faculty' },
  profilePicture: String,
  portfolioURL: String,
  publications: [String],
  researchInterests: [String],
  coursesTaught: [String],
  socialLinks: {
    linkedIn: String,
    researchGate: String,
  },
  otp: {
    type: String,
    required: false
  },
  otpExpires: {
    type: Date,
    required: false
  },
  createdAt: { type: Date, default: Date.now },
});

facultySchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("Faculty", facultySchema);