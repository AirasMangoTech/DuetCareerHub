const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  // Changed to array of ObjectIds

  contactNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "faculty" },
  profilePicture: String,

  dob: Date,
  address: String,
  personalizedDescription: String,
  linkedInUrl: String,
  gitHubUrl: String,

  academicDetails: {
    department: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true,
      },
    ],
    designation: { type: String, required: true },
    qualification: { type: String, required: true },
    experienceYear: String,
    specialization: String,
    subjects: [String],
    researchPapers: [String],
    awards: [String],
    skills: [String],
  },

  portfolioURL: String,
  publications: [String],
  researchInterests: [String],
  coursesTaught: [String],

  otp: {
    type: String,
    required: false,
  },
  otpExpires: {
    type: Date,
    required: false,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Faculty", facultySchema);
