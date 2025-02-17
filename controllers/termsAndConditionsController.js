const { validationResult } = require('express-validator');
const TermsAndConditions = require('../models/TermsAndConditions');

// Create or Update Terms and Conditions
exports.createOrUpdateTermsAndConditions = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg).join(', ');
    return res.status(400).json({ message: errorMessages });
  }

  try {
    const { heading, content } = req.body;
    const termsAndConditions = await TermsAndConditions.findOneAndUpdate(
      { heading },
      { content },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: "Terms and Conditions updated successfully!", termsAndConditions });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Terms and Conditions
exports.getTermsAndConditions = async (req, res) => {
  try {
    const termsAndConditions = await TermsAndConditions.find();
    res.status(200).json({ message: "Terms and Conditions retrieved successfully!", termsAndConditions });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Terms and Conditions by ID
exports.getTermsAndConditionsById = async (req, res) => {
  try {
    const termsAndConditions = await TermsAndConditions.findById(req.params.id);
    if (!termsAndConditions) {
      return res.status(404).json({ message: "Terms and Conditions not found!" });
    }
    res.status(200).json({ message: "Terms and Conditions retrieved successfully!", termsAndConditions });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Terms and Conditions by ID
exports.updateTermsAndConditions = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg).join(', ');
    return res.status(400).json({ message: errorMessages });
  }

  try {
    const { heading, content } = req.body;
    const termsAndConditions = await TermsAndConditions.findByIdAndUpdate(
      req.params.id,
      { heading, content },
      { new: true }
    );
    if (!termsAndConditions) {
      return res.status(404).json({ message: "Terms and Conditions not found!" });
    }
    res.status(200).json({ message: "Terms and Conditions updated successfully!", termsAndConditions });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Terms and Conditions
exports.deleteTermsAndConditions = async (req, res) => {
  try {
    const termsAndConditions = await TermsAndConditions.findByIdAndDelete(req.params.id);
    if (!termsAndConditions) {
      return res.status(404).json({ message: "Terms and Conditions not found!" });
    }
    res.status(200).json({ message: "Terms and Conditions deleted successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};