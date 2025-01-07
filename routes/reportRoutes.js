const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Routes
router.post('/create', reportController.createReport);
router.get('/all', reportController.getReports);
router.put('/suspend/:reportId', reportController.suspendUser);
router.put('/unsuspend/:reportId', reportController.unsuspendUser);

module.exports = router;

