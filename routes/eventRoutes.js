const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Create Event
router.post('/create', [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Date must be a valid ISO 8601 date'),
  eventController.uploadImage
], eventController.createEvent);

// Get All Events
router.get('/', eventController.getEvents);

// Get Event by ID
router.get('/:id', eventController.getEventById);

// Update Event
router.put('/:id', [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('address').notEmpty().withMessage('Address is required'),
  eventController.uploadImage
], eventController.updateEvent);

// Delete Event
router.delete('/:id', eventController.deleteEvent);

module.exports = router;