const express = require('express');
const authController = require('../controllers/authController');
const { verifyAdmin } = require('../middlewares/verifyAdmin');
const { verifyToken } = require('../middlewares/verifyToken'); 
// Middleware to verify JWT
const router = express.Router();
// Admin register route
router.post('/register-admin', authController.registerAdmin); // Admin self-registration
// User registration route (admin only)
router.post('/register', verifyAdmin, authController.registerUser); // Admin registers other users

// Login route
router.post('/login', authController.loginUser);

// Password reset and OTP verification
router.post('/reset-password', authController.forgetPassword); 

router.post('/verify-otp', authController.verifyOtp);
// Profile route
router.get('/profile', verifyToken, authController.getProfile);

module.exports = router;
