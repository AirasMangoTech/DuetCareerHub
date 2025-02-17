const Alumni = require('../models/Alumni');
const { validationResult } = require('express-validator');

// Create Alumni
exports.createAlumni = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg).join(', ');
    return res.status(400).json({ message: errorMessages });
  }

  try {
    const { name, lastname, department, rollNumber, graduationYear, degree, currentJobTitle, companyName, contactNumber, email, password } = req.body;

    // Check if rollNumber already exists
    const existingAlumni = await Alumni.findOne({ rollNumber });
    if (existingAlumni) {
      return res.status(400).json({ message: "Roll number already exists, please use a different roll number." });
    }

    // Check if email already exists
    const existingEmail = await Alumni.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists, please use a different email." });
    }

    // Create new alumni instance
    const alumni = new Alumni({ 
      name, 
      lastname, 
      department, 
      rollNumber, 
      graduationYear, 
      degree, 
      currentJobTitle, 
      companyName, 
      contactNumber, 
      email,
      password 
    });

    await alumni.save();
    res.status(201).json({ message: "Alumni created successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Alumni
exports.getAllAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.find();
    res.status(200).json(alumni);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Alumni by ID
exports.getAlumniById = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }
    res.status(200).json(alumni);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Alumni
exports.updateAlumni = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg).join(', ');
    return res.status(400).json({ message: errorMessages });
  }

  try {
    const { id } = req.params;
    const updateData = req.body;
    if (req.file) {
      updateData.profilePicture = req.file.path;
    }
    const alumni = await Alumni.findByIdAndUpdate(id, updateData, { new: true });
    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }
    res.status(200).json({ message: 'Alumni updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Alumni
exports.deleteAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndDelete(req.params.id);
    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }
    res.status(200).json({ message: 'Alumni deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};