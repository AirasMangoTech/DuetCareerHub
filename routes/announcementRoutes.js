const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');

// Create Announcement
router.post('/create', announcementController.createAnnouncement);

// Get All Announcements
router.get('/', announcementController.getAnnouncements);

// Get Announcement by ID
router.get('/:id', announcementController.getAnnouncementById);

// Update Announcement
router.put('/:id', announcementController.updateAnnouncement);

// Delete Announcement
router.delete('/:id', announcementController.deleteAnnouncement);

module.exports = router;