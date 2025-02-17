// routes/authRoutes.js
const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const router = express.Router();

// @route   POST /api/auth/login
// @desc    Authenticate user
// @access  Public
router.post('/login', [
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], authController.login);

// @route   POST /api/auth/forget-password
// @desc    Request password reset OTP
// @access  Public
router.post('/forget-password', [
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail()
], authController.forgetPassword);

// @route   POST /api/auth/verify-otp
// @desc    Verify password reset OTP
// @access  Public
router.post('/verify-otp', [
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('otp')
    .notEmpty().withMessage('OTP is required')
    .isLength({ min: 4, max: 4 }).withMessage('OTP must be 4 digits')
    .isNumeric().withMessage('OTP must contain only numbers')
], authController.verifyOtp);

// @route   POST /api/auth/reset-password
// @desc    Reset user password
// @access  Public
router.post('/reset-password', [
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('otp')
    .notEmpty().withMessage('OTP is required')
    .isLength({ min: 4, max: 4 }).withMessage('OTP must be 4 digits')
    .isNumeric().withMessage('OTP must contain only numbers'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], authController.resetPassword);

module.exports = router;