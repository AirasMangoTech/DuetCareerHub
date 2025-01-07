// models/Admin.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  department: String,
  designation: String,
  qualification: String,
  contactNumber: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
