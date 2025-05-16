const Alumni = require("../models/Alumni");
const Department = require("../models/Department");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { paginateData } = require("../utils/helper");

// Create Alumni
exports.createAlumni = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      responseCode: 400,
      message: errors
        .array()
        .map((error) => error.msg)
        .join(", "),
    });
  }

  try {
    const {
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
      password,
      cgpa,
    } = req.body;

    // Check if rollNumber already exists within the same department
    const existingAlumni = await Alumni.findOne({ rollNumber, department });
    if (existingAlumni) {
      return res.status(400).json({
        status: false,
        responseCode: 400,
        message:
          "Roll number already exists in this department, please use a different roll number.",
      });
    }

    // Check if email already exists
    const existingEmail = await Alumni.findOne({ email });
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

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new alumni instance
    const alumni = new Alumni({
      name,
      lastname,
      department,
      rollNumber,
      cgpa,
      graduationYear,
      degree,
      currentJobTitle,
      companyName,
      contactNumber,
      email,
      password: hashedPassword,
    });

    await alumni.save();
    const populatedAlumni = await Alumni.findById(alumni._id).populate(
      "department",
      "name"
    );

    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Alumni created successfully!",
      data: {
        _id: populatedAlumni._id,
        name: populatedAlumni.name,
        lastname: populatedAlumni.lastname,
        email: populatedAlumni.email,
        contactNumber: populatedAlumni.contactNumber,
        user_type: "alumni",
        department: {
          _id: populatedAlumni.department._id,
          name: populatedAlumni.department.name,
        },
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

// Get All Alumni (with Pagination and Search)
exports.getAllAlumni = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    search = search.trim();

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { lastname: { $regex: search, $options: "i" } },
        { rollNumber: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    

       const populateOpt = [
            {
              path: "department",
              select: "name",
            },
          ];
          const alumni = await paginateData(
            Alumni,
            page,
            limit,
            query,
            "-password -__v",
            populateOpt
          );

    if (!alumni || alumni.length === 0) {
      return res.status(404).json({
        status: false,
        responseCode: 404,
        message: "No alumni found matching the search criteria!",
        count: 0,
        data: [],
      });
    }

    const totalAlumni = await Alumni.countDocuments(query);

    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Alumni fetched successfully!",
      data: alumni
    });
  } catch (error) {
    console.error("Error fetching alumni:", error);
    res.status(500).json({
      status: false,
      responseCode: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get Alumni by ID
exports.getAlumniById = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id)
      .select("-password -__v")
      .populate("department", "name");
    if (!alumni) {
      return res.status(404).json({
        status: false,
        responseCode: 404,
        message: "Alumni not found",
      });
    }
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Alumni fetched successfully!",
      data: {
        _id: alumni._id,
        name: alumni.name,
        lastname: alumni.lastname,
        rollNumber: alumni.rollNumber,
        graduationYear: alumni.graduationYear,
        degree: alumni.degree,
        currentJobTitle: alumni.currentJobTitle,
        companyName: alumni.companyName,
        contactNumber: alumni.contactNumber,
        email: alumni.email,
        user_type: "alumni",
        department: alumni.department,
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

// Update Alumni
exports.updateAlumni = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      responseCode: 400,
      message: errors
        .array()
        .map((error) => error.msg)
        .join(", "),
    });
  }

  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if department exists if it's being updated
    if (updateData.department) {
      const departmentExists = await Department.findById(updateData.department);
      if (!departmentExists) {
        return res.status(400).json({
          status: false,
          responseCode: 400,
          message:
            "Department does not exist. You cannot update to this department.",
        });
      }
    }

    if (req.file) {
      updateData.profilePicture = req.file.path;
    }

    const updatedAlumni = await Alumni.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .select("-password -__v")
      .populate("department", "name");
    if (!updatedAlumni) {
      return res.status(404).json({
        status: false,
        responseCode: 404,
        message: "Alumni not found",
      });
    }
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Alumni updated successfully!",
      data: {
        _id: updatedAlumni._id,
        name: updatedAlumni.name,
        lastname: updatedAlumni.lastname,
        rollNumber: updatedAlumni.rollNumber,
        graduationYear: updatedAlumni.graduationYear,
        degree: updatedAlumni.degree,
        currentJobTitle: updatedAlumni.currentJobTitle,
        companyName: updatedAlumni.companyName,
        contactNumber: updatedAlumni.contactNumber,
        email: updatedAlumni.email,
        user_type: "alumni",
        department: updatedAlumni.department,
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

// Delete Alumni
exports.deleteAlumni = async (req, res) => {
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

    // Check if the alumni exists
    const alumni = await Alumni.findById(id);
    if (!alumni) {
      return res.status(404).json({
        status: false,
        responseCode: 404,
        message: "Alumni not found",
      });
    }

    // Delete the alumni
    await Alumni.findByIdAndDelete(id);

    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Alumni deleted successfully!",
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, responseCode: 500, message: error.message });
  }
};

exports.getAlumniStats = async (req, res) => {
  try {
    const totalAlumni = await Alumni.countDocuments();

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    startDate.setDate(1);
    const endDate = new Date();
    endDate.setDate(1);

    const totalAlumniLastMonth = await Alumni.countDocuments({
      createdAt: { $gte: startDate, $lt: endDate },
    });

    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Alumni statistics fetched successfully!",
      totalAlumni,
      totalAlumniLastMonth,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      responseCode: 500,
      message: error.message,
    });
  }
};
