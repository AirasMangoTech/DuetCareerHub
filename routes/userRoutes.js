const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyUser } = require("../middlewares/tokenVerify");

// Create User (Register)
router.post(
  "/create",
  userController.uploadResume,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("lastName").notEmpty().withMessage("Last Name is required"),
    body("department").notEmpty().withMessage("Department is required"),
    body("rollNumber").notEmpty().withMessage("Roll Number is required"),
    body("cgpa").notEmpty().withMessage("CGPA is required"),
    body("contactNumber").notEmpty().withMessage("Contact Number is required"),
    body("programYear").notEmpty().withMessage("Program/Year is required"),
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
  userController.createUser
);

router.post("/resume", verifyUser, userController.uploadResume);
router.get("/resume", verifyUser, userController.myResume);

// Get All Users
router.get("/all", userController.getAllUsers);

// Read User (Get Profile by ID)
router.get("/:id", userController.getUser);

// Update User (Edit Profile)
router.put("/:id", userController.updateUser);

// Delete User
router.delete("/:id", userController.deleteUser);

module.exports = router;
