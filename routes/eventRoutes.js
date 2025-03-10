const express = require('express');
const eventController = require('../controllers/eventController');
const router = express.Router();

// Create Event
router.post('/create', eventController.createEvent);

// Get All Events
router.get('/', eventController.getEvents);

// Get Event by ID
router.get('/:id', eventController.getEventById);

// Update Event
router.put('/:id', eventController.updateEvent);

// Delete Event
router.delete('/:id', eventController.deleteEvent);

module.exports = router;