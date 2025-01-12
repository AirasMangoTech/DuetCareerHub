const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const homePageController = require('../controllers/homePageController');

// Create or Update Home Page
router.post('/create-or-update', homePageController.uploadBannerImage, [
  body('bannerText').notEmpty().withMessage('Banner Text is required')
], homePageController.createOrUpdateHomePage);

// Get Home Page
router.get('/', homePageController.getHomePage);

// Delete Home Page
router.delete('/', homePageController.deleteHomePage);

module.exports = router;