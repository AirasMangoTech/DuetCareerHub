const { validationResult } = require('express-validator');
const User = require('../models/User');
const multer = require('multer');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

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
    return res.status(400).json({ 
      status: false,
      responseCode: 400,
      message: errorMessages 
    });
  }

  try {
    const { name, lastName, department, rollNumber, cgpa, contactNumber, programYear, email, password } = req.body;

    // Check if rollNumber already exists within the same department
    const existingUser = await User.findOne({ rollNumber, department });
    if (existingUser) {
      return res.status(400).json({ 
        status: false,
        responseCode: 400,
        message: "Roll number already exists in this department, please use a different roll number." 
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ 
        status: false,
        responseCode: 400,
        message: "Email already exists, please use a different email." 
      });
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
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "User created successfully!",
      data: {
        _id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        contactNumber: user.contactNumber,
        user_type: "user"
      }
    });
  } catch (error) {
    res.status(400).json({ 
      status: false,
      responseCode: 400,
      message: error.message 
    });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = '' } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    search = search.trim();

    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ]
    };

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-password -__v');

    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Users fetched successfully!",
      count: totalUsers,
      data: users
    });
  } catch (error) {
    res.status(400).json({ 
      status: false,
      responseCode: 400,
      message: error.message 
    });
  }
};

// Get User by ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -__v');
    if (!user) {
      return res.status(404).json({
        status: false,
        responseCode: 404,
        message: "User not found"
      });
    }
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "User fetched successfully!",
      data: user
    });
  } catch (error) {
    res.status(400).json({ 
      status: false,
      responseCode: 400,
      message: error.message 
    });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (req.file) {
      updateData.resume = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password -__v');
    if (!updatedUser) {
      return res.status(404).json({
        status: false,
        responseCode: 404,
        message: "User not found"
      });
    }
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "User updated successfully!",
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({ 
      status: false,
      responseCode: 400,
      message: error.message 
    });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        responseCode: 400,
        message: "Invalid ID format"
      });
    }

    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: false,
        responseCode: 404,
        message: "User not found"
      });
    }

    // Delete the user
    await User.findByIdAndDelete(id);

    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "User deleted successfully!"
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      responseCode: 500,
      message: error.message
    });
  }
};