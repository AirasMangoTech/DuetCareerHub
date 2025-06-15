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
    skills: [String],
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
    resumeUrl: String,

    // achievements: [String],
    // certifications: [String],
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
