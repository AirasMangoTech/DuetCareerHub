const { validationResult } = require('express-validator');
const HomePage = require('../models/HomePage');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to handle file upload
exports.uploadBannerImage = upload.single('bannerImage');

// Create or Update Home Page
exports.createOrUpdateHomePage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg).join(', ');
    return res.status(400).json({ message: errorMessages });
  }

  try {
    const { bannerText } = req.body;
    const homePageData = {
      bannerText
    };

    // If a banner image file is provided, add it to the homePageData object
    if (req.file) {
      homePageData.bannerImage = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    const homePage = await HomePage.findOneAndUpdate(
      {},
      homePageData,
      { new: true, upsert: true }
    );
    res.status(200).json({ message: "Home Page updated successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Home Page
exports.getHomePage = async (req, res) => {
  try {
    const homePage = await HomePage.findOne().select('-bannerImage.data');
    if (!homePage) {
      return res.status(404).json({ message: "Home Page not found!" });
    }
    res.status(200).json({ message: "Home Page retrieved successfully!", homePage });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Home Page
exports.deleteHomePage = async (req, res) => {
  try {
    const homePage = await HomePage.findOne();
    if (!homePage) {
      return res.status(404).json({ message: "Home Page not found!" });
    }
    await HomePage.deleteOne();
    res.status(200).json({ message: "Home Page deleted successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};