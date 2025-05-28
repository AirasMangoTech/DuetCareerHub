const Admin = require("../models/Admin");
const Alumni = require("../models/Alumni");
const Faculty = require("../models/Faculty");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Helper function to get user by email
const getUserByEmail = async (email) => {
  const regex = new RegExp(email, "i");

  return (
    (await Admin.findOne({ email: { $regex: regex } })) ||
    (await Alumni.findOne({ email: { $regex: regex } })) ||
    (await Faculty.findOne({ email: { $regex: regex } })) ||
    (await User.findOne({ email: { $regex: regex } }))
  );
};

// Login Controller
exports.login = async (req, res) => {  
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.role !== "admin") {
      // Generate 4-digit numeric OTP
      const otp = crypto.randomInt(1000, 10000).toString();
      user.otp = otp;
      user.otpExpires = Date.now() + 600000; // 10 minutes
      await user.save();

      console.log(process.env.EMAIL, process.env.EMAIL_PASSWORD);
      // Email configuration
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      await transporter.sendMail({
        to: user.email,
        from: process.env.EMAIL,
        subject: "Verification OTP",
        text: `Your OTP for verification is ${otp} (valid for 10 minutes)`,
      });
      res.status(200).json({ codeSent: true, message: "OTP sent to email" });
    } else {
      const userResponse = user.toObject();
      delete userResponse.password;

      const token = jwt.sign(
        { _id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Login successful",
        token,
        user: userResponse,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.verify = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const regex = new RegExp(email, "i");
    let query = { email: { $regex: regex }, otp };

    const user =
      (await Alumni.findOne(query)) ||
      (await Faculty.findOne(query)) ||
      (await User.findOne(query));

    if (!user) {
      return res.status(404).json({ message: "Invalid Code" });
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Forget Password Controller
exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 4-digit numeric OTP
    const otp = crypto.randomInt(1000, 10000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 600000; // 10 minutes
    await user.save();

    // Email configuration
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      to: user.email,
      from: process.env.EMAIL,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp} (valid for 10 minutes)`,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password Controller
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
