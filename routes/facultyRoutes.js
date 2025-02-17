const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const facultyController = require('../controllers/facultyController');

// Create Faculty (Register)
router.post('/create', [
  body('name').notEmpty().withMessage('Name is required'),
  body('lastname').notEmpty().withMessage('Last Name is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('designation').notEmpty().withMessage('Designation is required'),
  body('qualification').notEmpty().withMessage('Qualification is required'),
  body('contactNumber').notEmpty().withMessage('Contact Number is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 10 }).withMessage('Password must be at least 10 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
], facultyController.createFaculty);

// Get All Facultiesx
router.get('/all', facultyController.getAllFaculties);

// Get Faculty by ID
router.get('/:id', facultyController.getFaculty);

// Update Faculty
router.put('/:id', facultyController.updateFaculty);

// Delete Faculty
router.delete('/:id', facultyController.deleteFaculty);

module.exports = router;