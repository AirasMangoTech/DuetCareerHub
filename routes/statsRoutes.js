const express = require("express");
const statsController = require("../controllers/statsController");
const router = express.Router();

// Route to get statistics
router.get("/stats", statsController.getStats);
router.get("/home-data", statsController.getHome);

module.exports = router;
