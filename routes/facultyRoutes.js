const express = require("express");
const { body } = require("express-validator");
const facultyController = require("../controllers/facultyController");
const multer = require("multer");
const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create Faculty
router.post(
  "/create",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("lastname").notEmpty().withMessage("Last name is required"),
    body("designation").notEmpty().withMessage("Designation is required"),
    body("qualification").notEmpty().withMessage("Qualification is required"),
    body("contactNumber").notEmpty().withMessage("Contact number is required"),
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  facultyController.createFaculty
);

// Get All Faculties
router.get("/", facultyController.getAllFaculties);

// Get Faculty by ID
router.get("/:id", facultyController.getFacultyById);

// Update Faculty
router.put("/:id", facultyController.updateFaculty);

// Delete Faculty
router.delete("/:id", facultyController.deleteFaculty);

module.exports = router;
