const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  }, // Single ObjectId
  rollNumber: { type: String, required: true },
  cgpa: String,

  graduationYear: { type: Number, required: true },
  degree: { type: String, required: true },
  currentJobTitle: { type: String },
  companyName: { type: String },
  contactNumber: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "alumni" },
  profilePicture: String,
  resume: {
    data: Buffer,
    contentType: String,
  },

  dob: Date,
  address: String,
  personalizedDescription: String,
  linkedInUrl: String,
  gitHubUrl: String,
  academicDetails: {
    enrollNumber: String,
    department: String,
    semester: String,
  },
  matriculationDetails: {
    schoolName: String,
    passingYear: String,
    grade: String,
  },
  intermediateDetails: {
    collegeName: String,
    passingYear: String,
    grade: String,
  },

  workExperience: [
    {
      companyName: String,
      jobTitle: String,
      startYear: String,
      endYear: String,
      responsibilities: String,
    },
  ],

  portfolioURL: String,
  skills: [String],
  certifications: [String],

  achievements: [String],
  createdAt: { type: Date, default: Date.now },
  otp: {
    type: String,
    required: false,
  },
  otpExpires: {
    type: Date,
    required: false,
  },
});

module.exports = mongoose.model("Alumni", alumniSchema);
