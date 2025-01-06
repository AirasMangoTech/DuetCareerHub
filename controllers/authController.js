const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
      // Admin registers themselves
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
       // Check if the email is already taken
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin', // Admin role
    });
    await admin.save();
    res.status(201).json({ message: 'Admin registered successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering admin.', error });
  }
};
// Admin can register other roles (students, alumni, faculty)
exports.registerUser  = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // Input validation: Check if all required fields are provided
    if (!name) {
      return res.status(400).json({ message: 'Name is required.' });
    }
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required.' });
    }
    if (!role) {
      return res.status(400).json({ message: 'Role is required.' });
    }

    // Only allow admin to register other users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can register users.' });
    }

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: 'Invalid email format. Please provide a valid email address.' });
    }

    // Validate password: must be exactly 8 characters long, contain at least one uppercase letter, one lowercase letter, and one digit
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8}$/;
    if (!passwordPattern.test(password)) {
      return res.status(400).json({
        message: 'Password must be exactly 8 characters long, contain at least one uppercase letter, one lowercase letter, and one digit.',
      });
    }

    // Create and save the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();
    res.status(201).json({ message: 'User  registered successfully.' });
  } catch (error) {
    // Handle potential errors (e.g., database errors, email already in use, etc.)
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: 'Email already exists. Please use a different email.' });
    }
    res.status(500).json({ message: 'Error registering user.', error });
  }
};

exports.loginUser  = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User  not found.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7h',
    });
    res.status(200).json({ message: 'Login successful.', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in.', error });
  }
};
exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User  not found. Please check the email address.' });
    }
    // Generate OTP and expiration
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    await user.save();
    // Absolute URL for the logo
    const logoUrl = 'https://i.ibb.co/4mvDvdR/duet-logo.jpg'; 
    // HTML Email Template with Inline CSS
    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', sans-serif; background-color: #ffffff; color: #333; padding: 20px; border-radius: 12px; max-width: 600px; margin: 0 auto; box-shadow: 0 0 25px rgba(0, 0, 0, 0.1); background-color: #fdfdfd; border: 1px solid #e1e1e1;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${logoUrl}" alt="DuetHub Logo" style="width: 100px; height: auto;"/>
        </div>
        <h2 style="font-size: 28px; color: #333; text-align: center; font-weight: 700; margin-bottom: 15px;">DuetHub</h2>
        <p style="font-size: 18px; line-height: 1.8; color: #555; margin-bottom: 15px;">Dear User,</p>
        <p style="font-size: 18px; line-height: 1.8; color: #555; margin-bottom: 15px;">Your OTP for resetting your password is:</p>
        <div style="font-size: 36px; font-weight: bold; color: #007bff; text-align: center; margin: 25px 0; background-color: #f0f9ff; padding: 15px; border-radius: 8px; letter-spacing: 2px; box-shadow: 0 0 10px rgba(0, 123, 255, 0.2);">${otp}</div>
        <p style="font-size: 18px; line-height: 1.8; color: #555; margin-bottom: 15px;">This OTP will expire in <strong>10 minutes</strong>. Please use it promptly to reset your password.</p>
        <p style="font-size: 18px; line-height: 1.8; color: #555; margin-bottom: 15px;">If you didn’t request this, please ignore this email.</p>
        <p style="font-size: 18px; line-height: 1.8; color: #555; margin-bottom: 15px;">Thank you,<br><strong>Duet Team</strong></p>
        <footer style="text-align: center; font-size: 14px; color: #999; margin-top: 30px;">
          © 2025 Duet. All Rights Reserved.
        </footer>
      </div>
    `;
    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset OTP - DuetHub',
      html: htmlContent,
    });

    res.status(200).json({ message: 'OTP has been sent to your email address.' });
  } catch (error) {
    console.error('Error in forgetPassword:', error); 
    res.status(500).json({ message: 'An error occurred while sending the OTP.', error });

  }}
;
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Define password policy
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if OTP matches and is still valid (not expired)
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired.' });
    }

    // Validate the new password
    if (!passwordPattern.test(newPassword)) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.',
      });
    }
    // Hash the new password
    user.password = await bcrypt.hash(newPassword, 10);
    // Clear OTP fields after successful verification
    user.otp = undefined;
    user.otpExpiry = undefined;
    // Save the new password in the database
    await user.save();
    res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password.', error });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assumes `req.user` contains the authenticated user's ID from a JWT middleware
    const user = await User.findById(userId).select('-password -otp -otpExpiry'); // Exclude sensitive fields

    if (!user) {
      return res.status(404).json({ message: 'User  not found.' });
    }

    // Construct the profile response
    const profileResponse = {
      profile: {
        isAdmin: user.role === 'admin', // Set isAdmin based on the user's role
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        __v: user.__v 
      }
    };
    // Send a welcome message along with the profile information
    res.status(200).json({
      profile: profileResponse.profile
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving profile.', error });
  }
};