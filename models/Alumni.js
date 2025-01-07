// models/Alumni.js
const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  department: String,
  rollNumber: String,
  graduationYear: String,
  degree: String,
  currentJobTitle: String,
  companyName: String,
  contactNumber: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('Alumni', alumniSchema);
