const Department = require("../models/Department");

// Get All Departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Departments fetched successfully!",
      data: departments,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message,
    });
  }
};

// Create Department (optional, if you need to add departments)
exports.createDepartment = async (req, res) => {
  try {
    const { name, Chairman_name } = req.body;

    // Check if department already exists
    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) {
      return res.status(400).json({
        status: false,
        responseCode: 400,
        message: "Department already exists",
      });
    }

    const department = new Department({ name, Chairman_name });
    await department.save();
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Department created successfully!",
      data: department,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message,
    });
  }
};

exports.updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { name, Chairman_name } = req.body;

  try {
    const department = await Department.findByIdAndUpdate(
      id,
      { name, Chairman_name },
      { new: true }
    );
    if (!department) {
      return res.status(404).json({
        status: false,
        responseCode: 404,
        message: "Department not found",
      });
    }
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Department updated successfully!",
      data: department,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message,
    });
  }
};
exports.deleteDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    const department = await Department.findByIdAndDelete(id);
    if (!department) {
      return res.status(404).json({
        status: false,
        responseCode: 404,
        message: "Department not found",
      });
    }
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Department deleted successfully!",
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message,
    });
  }
};
