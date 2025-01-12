const { validationResult } = require('express-validator');
const User = require('../models/User');
const multer = require('multer');
const bcrypt = require('bcrypt');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to handle file upload
exports.uploadResume = upload.single('resume');

// Create User (Registration)
exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg).join(', ');
    return res.status(400).json({ message: errorMessages });
  }

  try {
    const { name, lastName, department, rollNumber, cgpa, contactNumber, programYear, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists, please use a different email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      lastName,
      department,
      rollNumber,
      cgpa,
      contactNumber,
      programYear,
      email,
      password: hashedPassword
    });

    // If a resume file is provided, add it to the user object
    if (req.file) {
      user.resume = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    await user.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -__v');
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Read User (Get Profile by ID)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -__v');
    if (!user) return res.status(404).json({ message: "User not found!" });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update User (Edit Profile)
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password -__v');
    if (!updatedUser) return res.status(404).json({ message: "User not found!" });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found!" });
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};