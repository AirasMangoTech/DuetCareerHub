const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: String,
    lastName: String,
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    }, // Single ObjectId
    rollNumber: String,
    cgpa: String,
    contactNumber: String,
    programYear: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: String,
    resume: {
      data: Buffer,
      contentType: String,
    },
    portfolioURL: String,
    socialLinks: {
      linkedIn: String,
      github: String,
    },
    achievements: [String],
    skills: [String],
    certifications: [String],
    otp: {
      type: String,
      required: false,
    },
    otpExpires: {
      type: Date,
      required: false,
    },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
