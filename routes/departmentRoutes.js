const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const departmentController = require("../controllers/departmentController");

// Get All Departments
router.get("/", departmentController.getAllDepartments);

// Create Department (optional, if you need to add departments)
router.post(
  "/create",
  [body("name").notEmpty().withMessage("Name is required")],
  [body("Chairman_name").notEmpty().withMessage("Chairman Name is required")],
  departmentController.createDepartment
);

router.put("/update/:id", departmentController.updateDepartment);
router.delete("/delete/:id", departmentController.deleteDepartment);

module.exports = router;
