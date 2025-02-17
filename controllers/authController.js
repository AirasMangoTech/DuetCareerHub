// authController.js (Updated)
const Admin = require('../models/Admin');
const Alumni = require('../models/Alumni');
const Faculty = require('../models/Faculty');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const getUserByEmail = async (email) => {
  return await Admin.findOne({ email }) || 
         await Alumni.findOne({ email }) || 
         await Faculty.findOne({ email }) || 
         await User.findOne({ email });
};

// Updated Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create user response without sensitive data
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.otp;
    delete userResponse.otpExpires;

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      user: userResponse 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Updated Forget Password Controller
exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate 4-digit numeric OTP
    const otp = crypto.randomInt(1000, 10000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 600000; // 10 minutes
    await user.save();

    // Email configuration
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      to: user.email,
      from: process.env.EMAIL,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is ${otp} (valid for 10 minutes)`
    });

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rest of the controllers remain the same...