const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Create Admin (Register)

router.get("/dashboard", adminController.dashboard);

router.post(
  "/create",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("lastName").notEmpty().withMessage("Last Name is required"),
    body("department").notEmpty().withMessage("Department is required"),
    body("designation").notEmpty().withMessage("Designation is required"),
    body("qualification").notEmpty().withMessage("Qualification is required"),
    body("contactNumber").notEmpty().withMessage("Contact Number is required"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 10 })
      .withMessage("Password must be at least 10 characters long")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number"),
  ],
  adminController.createAdmin
);

// Get All Admins
router.get("/all", adminController.getAllAdmins);

// Read Admin (Get Admin by ID)
router.get("/:id", adminController.getAdmin);

// Update Admin
router.put("/:id", adminController.updateAdmin);

// Delete Admin
router.delete("/:id", adminController.deleteAdmin);
module.exports = router;
