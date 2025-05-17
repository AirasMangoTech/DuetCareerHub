const express = require("express");
const { body } = require("express-validator");
const alumniController = require("../controllers/alumniController");
const router = express.Router();

// Create Alumni
router.post(
  "/create",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("lastname").notEmpty().withMessage("Last name is required"),
    body("department").notEmpty().withMessage("Department is required"),
    body("rollNumber").notEmpty().withMessage("Roll number is required"),
    body("cgpa").notEmpty().withMessage("Roll number is required"),
    body("graduationYear")
      .notEmpty()
      .withMessage("Graduation year is required"),
    body("degree").notEmpty().withMessage("Degree is required"),
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  alumniController.createAlumni
);

// Get All Alumni
router.get("/", alumniController.getAllAlumni);

// Route to count total alumni and alumni registered last month
router.get("/count", alumniController.getAlumniStats);

// Get Alumni by ID
router.get("/:id", alumniController.getAlumniById);

// Update Alumni
router.put(
  "/:id",
  
  alumniController.updateAlumni
);

// Delete Alumni
router.delete("/:id", alumniController.deleteAlumni);

module.exports = router;
