const { validationResult } = require('express-validator');
const Faculty = require('../models/Faculty');
const Department = require('../models/Department');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Create Faculty (Register)
exports.createFaculty = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
        status: false,
        responseCode: 400, 
        message: errors.array().map(error => error.msg).join(', ') });
  }

  try {
    const { name, lastname, department, designation, qualification, contactNumber, email, password } = req.body;

    // Check if email already exists
    const existingEmail = await Faculty.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ status: false, responseCode: 400, message: "Email already exists, please use a different email." });
    }

    // Check if departments exist
    const departments = await Department.find({ _id: { $in: department } });
    if (departments.length !== department.length) {
      return res.status(400).json({ status: false, responseCode: 400, message: "One or more departments do not exist." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const faculty = new Faculty({ name, lastname, department, designation, qualification, contactNumber, email, password: hashedPassword });
    await faculty.save();

    const populatedFaculty = await Faculty.findById(faculty._id).populate('department', 'name');

    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Faculty created successfully!",
      data: {
        _id: populatedFaculty._id,
        first_name: populatedFaculty.name,
        last_name: populatedFaculty.lastname,
        email: populatedFaculty.email,
        phone: populatedFaculty.contactNumber,
        user_type: "faculty",
        department: populatedFaculty.department // Include department details
      }
    });
  } catch (error) {
    res.status(400).json({ 
      status: false, 
      responseCode: 400, 
      message: error.message });
  }
};

// Get All Faculties (with Pagination, Search, and Sorting)
exports.getAllFaculties = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = '' } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    search = search.trim();

    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { lastname: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    };

    const faculties = await Faculty.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .select('-password -__v')
      .populate('department', 'name');

    const totalFaculties = await Faculty.countDocuments(query);

    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Faculties fetched successfully!",
      count: totalFaculties,
      data: faculties
    });
  } catch (error) {
    res.status(400).json({ 
      status: false, 
      responseCode: 400, 
      message: error.message });
  }
};

// Get Faculty by ID
exports.getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id).populate('department', 'name').select('-password -__v');
    if (!faculty) {
      return res.status(404).json({ 
        status: false, 
        responseCode: 404, 
        message: "Faculty not found" });
    }
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Faculty fetched successfully!",
      data: faculty
    });
  } catch (error) {
    res.status(400).json({ 
      status: false, 
      responseCode: 400,
       message: error.message });
  }
};

// Update Faculty
exports.updateFaculty = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: false, 
      responseCode: 400,
       message: errors.array().map(error => error.msg).join(', ') });
  }

  try {
    const { id } = req.params;
    const updateData = req.body;
    if (req.file) {
      updateData.profilePicture = req.file.path;
    }
    const faculty = await Faculty.findByIdAndUpdate(id, updateData, { new: true }).select('-password -__v').populate('department', 'name');
    if (!faculty) {
      return res.status(404).json({ 
        status: false,
         responseCode: 404, 
         message: "Faculty not found" });
    }
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Faculty updated successfully!",
      data: faculty
    });
  } catch (error) {
    res.status(400).json({ 
      status: false, 
      responseCode: 400, 
      message: error.message });
  }
};

// Delete Faculty
exports.deleteFaculty = async (req, res) => {
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

    // Check if the faculty exists
    const faculty = await Faculty.findById(id);
    if (!faculty) {
      return res.status(404).json({ 
        status: false, 
        responseCode: 404, 
        message: "Faculty not found" });
    }

    // Delete the faculty
    await Faculty.findByIdAndDelete(id);

    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Faculty deleted successfully!"
    });

  } catch (error) {
    res.status(500).json({ status: false, 
      responseCode: 500, 
      message: error.message });
  }
};