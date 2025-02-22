const Department = require('../models/Department');

// Get All Departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Departments fetched successfully!",
      data: departments
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message
    });
  }
};

// Create Department (optional, if you need to add departments)
exports.createDepartment = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if department already exists
    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) {
      return res.status(400).json({
        status: false,
        responseCode: 400,
        message: "Department already exists"
      });
    }

    const department = new Department({ name });
    await department.save();
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Department created successfully!",
      data: department
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message
    });
  }
};