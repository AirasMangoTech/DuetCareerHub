const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/events', eventController.createEvent);

// Get All Events
router.get('/events', eventController.getEvents);

// Get Event by ID
router.get('/events/:id', eventController.getEventById);

// Update Event
router.put('/events/:id', eventController.updateEvent);

// Delete Event
router.delete('/events/:id', eventController.deleteEvent);

module.exports = router;