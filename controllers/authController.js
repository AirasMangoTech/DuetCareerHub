const Admin = require("../models/Admin");
const Alumni = require("../models/Alumni");
const Faculty = require("../models/Faculty");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();
const path = require("path");
const fs = require("fs");

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
      const templatePath = path.join(
        __dirname,
        "..",
        "EmailTemplate",
        "Email.html"
      );

      let emailTemplate = fs.readFileSync(templatePath, "utf8");
      const [otp1, otp2, otp3, otp4] = otp.split("");

      const personalizedHtml = emailTemplate
        .replace("${otp1}", otp1)
        .replace("${otp2}", otp2)
        .replace("${otp3}", otp3)
        .replace("${otp4}", otp4);

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Verification OTP",
        html: personalizedHtml,
      };

      console.log(`Preparing to send email to: ${email}`);

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to: ${email}`);
        console.log(`Email response: ${info.response}`);
        return res.status(200).json({ message: "OTP sent to email" });
      } catch (error) {
        console.error(`❌ Failed to send email to: ${email}`);
        return res.status(400).json({ message: "Failed to send OTP" });

        console.error(`Error: ${error.message}`);
      }
    } else {
      const userResponse = user.toObject();
      delete userResponse.password;

      const token = jwt.sign(
        { _id: user._id, role: user.role },
        process.env.JWT_SECRET
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
      process.env.JWT_SECRET
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

    const templatePath = path.join(
      __dirname,
      "..",
      "EmailTemplate",
      "Email.html"
    );

    let emailTemplate = fs.readFileSync(templatePath, "utf8");
    const [otp1, otp2, otp3, otp4] = otp.split("");

    const personalizedHtml = emailTemplate
      .replace("${otp1}", otp1)
      .replace("${otp2}", otp2)
      .replace("${otp3}", otp3)
      .replace("${otp4}", otp4);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verification OTP",
      html: personalizedHtml,
    };

    console.log(`Preparing to send email to: ${email}`);

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to: ${email}`);
      console.log(`Email response: ${info.response}`);
      return res.status(200).json({ message: "OTP sent to email" });
    } catch (error) {
      console.error(`❌ Failed to send email to: ${email}`);
      return res.status(400).json({ message: "Failed to send OTP" });

      console.error(`Error: ${error.message}`);
    }
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
