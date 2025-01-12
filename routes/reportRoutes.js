const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Create Report
router.post('/create', reportController.createReport);

// Get All Reports
router.get('/all', reportController.getReports);

// Suspend User
router.put('/suspend/:reportId', reportController.suspendUser);

// Unsuspend User
router.put('/unsuspend/:reportId', reportController.unsuspendUser);


module.exports = router;