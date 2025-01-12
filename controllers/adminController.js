const { validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

// Create Admin (Register)
exports.createAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg).join(', ');
    return res.status(400).json({ message: errorMessages });
  }

  try {
    const { name, lastName, department, designation, qualification, contactNumber, email, password } = req.body;

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already exists, please use a different email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, lastName, department, designation, qualification, contactNumber, email, password: hashedPassword });
    await admin.save();
    res.status(201).json({ message: "Admin created successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password -__v');
    res.status(200).json(admins);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Read Admin (Get Admin by ID)
exports.getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password -__v');
    if (!admin) return res.status(404).json({ message: "Admin not found!" });
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Admin
exports.updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password -__v');
    if (!updatedAdmin) return res.status(404).json({ message: "Admin not found!" });
    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Admin
exports.deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) return res.status(404).json({ message: "Admin not found!" });
    res.status(200).json({ message: "Admin deleted successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};