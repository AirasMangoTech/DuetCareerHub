const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');

router.post('/announcements', announcementController.createAnnouncement);
router.get('/announcements', announcementController.getAnnouncements);
router.get('/announcements/:id', announcementController.getAnnouncementById);
router.put('/announcements/:id', announcementController.updateAnnouncement);
router.delete('/announcements/:id', announcementController.deleteAnnouncement);

module.exports = router;