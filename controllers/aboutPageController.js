const { validationResult } = require('express-validator');
const AboutPage = require('../models/AboutPage');

// Create or Update About Page
exports.createOrUpdateAboutPage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg).join(', ');
    return res.status(400).json({ message: errorMessages });
  }

  try {
    const { missionStatement, platformOverview } = req.body;
    const aboutPage = await AboutPage.findOneAndUpdate(
      {},
      { missionStatement, platformOverview },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: "About Page updated successfully!", aboutPage });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get About Page
exports.getAboutPage = async (req, res) => {
  try {
    const aboutPage = await AboutPage.findOne();
    if (!aboutPage) {
      return res.status(404).json({ message: "About Page not found!" });
    }
    res.status(200).json({ message: "About Page retrieved successfully!", aboutPage });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete About Page
exports.deleteAboutPage = async (req, res) => {
  try {
    const aboutPage = await AboutPage.findOne();
    if (!aboutPage) {
      return res.status(404).json({ message: "About Page not found!" });
    }
    await AboutPage.deleteOne();
    res.status(200).json({ message: "About Page deleted successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};