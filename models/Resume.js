const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    personalInfo: {
      image: String,
      fullname: String,
      email: String,
      phoneNum: String,
      dob: String,
      address: String,
      description: String,
      linkedInUrl: String,
      gitHubUrl: String,
    },
    educationalBackground: {
      academicDetails: {
        enrollNumber: String,
        department: String,
        semester: String,
      },
      matriculationDetails: {
        schoolName: String,
        passingYear: Date,
        grade: String,
      },
      intermediateDetails: {
        collegeName: String,
        passingYear: Date,
        grade: String,
      },
      skills: Array,
    },
    workExperience: [
      {
        companyName: String,
        jobTitle: String,
        startDate: Date,
        endDate: Date,
        responsibilities: String,
      },
    ],
    resumeUrl: String,
  },
  {
    timestamps: true,
  }
);
const Resume = mongoose.model("Resume", resumeSchema);
module.exports = Resume;
