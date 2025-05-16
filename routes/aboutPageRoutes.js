const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const aboutPageController = require("../controllers/aboutPageController");

// Create or Update About Page
router.post(
  "/create-or-update",
  [
    body("missionStatement")
      .notEmpty()
      .withMessage("Mission Statement is required"),
    body("platformOverview")
      .notEmpty()
      .withMessage("Platform Overview is required"),
  ],
  aboutPageController.createOrUpdateAboutPage
);

// Get About Page
router.get("/", aboutPageController.getAboutPage);

// Delete About Page
router.delete("/", aboutPageController.deleteAboutPage);

module.exports = router;
