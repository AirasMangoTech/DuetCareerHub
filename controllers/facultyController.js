const { validationResult } = require('express-validator');
const Faculty = require('../models/Faculty');
const bcrypt = require('bcrypt');

// Create Faculty (Register)
exports.createFaculty = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg).join(', ');
    return res.status(400).json({ message: errorMessages });
  }

  try {
    const { name, lastname, department, designation, qualification, contactNumber, email, password } = req.body;

    // Check if email already exists
    const existingFaculty = await Faculty.findOne({ email });
    if (existingFaculty) {
      return res.status(400).json({ message: "Email already exists, please use a different email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const faculty = new Faculty({ name, lastname, department, designation, qualification, contactNumber, email, password: hashedPassword });
    await faculty.save();
    res.status(201).json({ message: "Faculty created successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Faculties
exports.getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find().select('-password -__v');
    res.status(200).json(faculties);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Faculty by ID
exports.getFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id).select('-password -__v');
    if (!faculty) return res.status(404).json({ message: "Faculty not found!" });
    res.status(200).json(faculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Faculty
exports.updateFaculty = async (req, res) => {
  try {
    const updatedFaculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password -__v');
    if (!updatedFaculty) return res.status(404).json({ message: "Faculty not found!" });
    res.status(200).json(updatedFaculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Faculty
exports.deleteFaculty = async (req, res) => {
  try {
    const deletedFaculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!deletedFaculty) return res.status(404).json({ message: "Faculty not found!" });
    res.status(200).json({ message: "Faculty deleted successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};