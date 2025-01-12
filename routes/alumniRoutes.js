const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const alumniController = require('../controllers/alumniController');

// Create Alumni (Register)
router.post('/create', [
  body('name').notEmpty().withMessage('Name is required'),
  body('lastname').notEmpty().withMessage('Last Name is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('rollNumber').notEmpty().withMessage('Roll Number is required'),
  body('graduationYear').notEmpty().withMessage('Graduation Year is required'),
  body('degree').notEmpty().withMessage('Degree is required'),
  body('currentJobTitle').notEmpty().withMessage('Current Job Title is required'),
  body('companyName').notEmpty().withMessage('Company Name is required'),
  body('contactNumber').notEmpty().withMessage('Contact Number is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 10 }).withMessage('Password must be at least 10 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
], alumniController.createAlumni);

// Get All Alumni
router.get('/all', alumniController.getAllAlumni);

// Read Alumni (Get Alumni by ID)
router.get('/:id', alumniController.getAlumni);

// Update Alumni
router.put('/:id', alumniController.updateAlumni);

// Delete Alumni
router.delete('/:id', alumniController.deleteAlumni);

module.exports = router;