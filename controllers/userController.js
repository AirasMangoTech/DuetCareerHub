const { validationResult } = require("express-validator");
const User = require("../models/User");
const Department = require("../models/Department");
const multer = require("multer");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { paginateData } = require("../utils/helper");
const Resume = require("../models/Resume");
const post = require("../models/post");
const job = require("../models/job");
const notification = require("../models/notification");
const chat = require("../models/chat");

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to handle file upload

// Create User (Registration)
exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error) => error.msg)
      .join(", ");
    return res.status(400).json({
      status: false,
      responseCode: 400,
      message: errorMessages,
    });
  }

  try {
    const {
      name,
      lastName,
      department,
      rollNumber,
      cgpa,
      contactNumber,
      programYear,
      email,
      password,
    } = req.body;

    // Check if rollNumber already exists within the same department
    const existingUser = await User.findOne({ rollNumber, department });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        responseCode: 400,
        message:
          "Roll number already exists in this department, please use a different roll number.",
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        status: false,
        responseCode: 400,
        message: "Email already exists, please use a different email.",
      });
    }

    // Check if department exists
    const departmentExists = await Department.findById(department);
    if (!departmentExists) {
      return res.status(400).json({
        status: false,
        responseCode: 400,
        message: "Department does not exist. You cannot register.",
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
      password: hashedPassword,
    });

    // If a resume file is provided, add it to the user object
    if (req.file) {
      user.resume = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await user.save();
    const populatedUser = await User.findById(user._id).populate(
      "department",
      "name"
    );

    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "User created successfully!",
      data: {
        _id: populatedUser._id,
        name: populatedUser.name,
        lastName: populatedUser.lastName,
        email: populatedUser.email,
        contactNumber: populatedUser.contactNumber,
        user_type: "user",
        department: populatedUser.department, // Include department details
      },
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message,
    });
  }
};

exports.uploadResume = async (req, res) => {
  const user = req.user._id;
  try {
    const findUser = await User.findById(user, "resumeUrl");
    const alreadyExists = await Resume.findOne({
      user: user,
    });
    if (alreadyExists) {
      const updatedResume = await Resume.findOneAndUpdate(
        { user: user },
        {
          $set: {
            personalInfo: req.body.personalInfo,
            educationalBackground: req.body.educationalBackground,
            workExperience: req.body.workExperience,
            resumeUrl: req.body.resumeUrl,
          },
        },
        { new: true }
      );
      res.status(200).json({
        status: true,
        responseCode: 200,
        message: "Resume updated successfully!",
        data: updatedResume,
      });
    } else {
      const newResume = new Resume({
        user: user,
        personalInfo: req.body.personalInfo,
        educationalBackground: req.body.educationalBackground,
        workExperience: req.body.workExperience,
        resumeUrl: req.body.resumeUrl,
      });

      findUser.resumeUrl = req.body.resumeUrl;
      await findUser.save();
      const savedResume = await newResume.save();
      res.status(201).json({
        status: true,
        responseCode: 201,
        message: "Resume created successfully!",
        data: savedResume,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message,
    });
  }
};
exports.myResume = async (req, res) => {
  const user = req.user._id;
  try {
    const myResume = await Resume.findOne({
      user: user,
    });

    res.status(201).json({
      status: true,
      responseCode: 200,
      data: myResume,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message,
    });
  }
};

// Get All Users (with Pagination and Search)
exports.getAllUsers = async (req, res) => {
  let { page = 1, limit = 10, search = "" } = req.query;
  try {
    page = parseInt(page);
    limit = parseInt(limit);
    search = search.trim();

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { rollNumber: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const populateOpt = [
      {
        path: "department",
        select: "name",
      },
    ];
    const users = await paginateData(
      User,
      page,
      limit,
      query,
      "-password -__v",
      populateOpt
    );

    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Users fetched successfully!",
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message,
    });
  }
};

// Get User by ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -__v")
      .populate("department", "name");
    if (!user) {
      return res.status(404).json({
        status: false,
        responseCode: 404,
        message: "User not found",
      });
    }
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "User fetched successfully!",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message,
    });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .select("-password -__v")
      .populate("department", "name");

    if (!updatedUser) {
      return res.status(404).json({
        status: false,
        responseCode: 404,
        message: "User not found",
      });
    }
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "User updated successfully!",
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message,
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
        message: "Invalid ID format",
      });
    }

    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: false,
        responseCode: 404,
        message: "User not found",
      });
    }

    // Delete the user
    await User.findByIdAndDelete(id);
    await post.deleteMany({ user: id });
    await job.deleteMany({ user: id });
    await Resume.deleteMany({ user: id });
    await notification.deleteMany({ receiverId: id });
    await chat.deleteMany({ $or: [{ sender: id }, { receiver: id }] });
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "User deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      responseCode: 500,
      message: error.message,
    });
  }
};
