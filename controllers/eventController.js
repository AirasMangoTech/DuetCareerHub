const Event = require('../models/Event');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to handle file upload
exports.uploadImage = upload.single('image');

// Create Event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, address, date } = req.body;
    const event = new Event({
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      },
      title,
      description,
      address,
      date
    });
    await event.save();
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Event created successfully!",
      data: {
        _id: event._id,
        title: event.title,
        description: event.description,
        address: event.address,
        date: event.date,
        imageUrl: `/api/event/${event._id}`
      }
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message
    });
  }
};

// Get All Events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    const eventsWithImageUrl = events.map(event => ({
      _id: event._id,
      title: event.title,
      description: event.description,
      address: event.address,
      date: event.date,
      imageUrl: `/api/event/${event._id}`
    }));
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Events fetched successfully!",
      data: eventsWithImageUrl
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message
    });
  }
};

// Get Event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        status: false,
        responseCode: 404,
        message: "Event not found"
      });
    }
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Event fetched successfully!",
      data: {
        _id: event._id,
        title: event.title,
        description: event.description,
        address: event.address,
        date: event.date,
        imageUrl: `/api/event/${event._id}`
      }
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message
    });
  }
};

// Update Event
exports.updateEvent = async (req, res) => {
  try {
    const { title, description, address, date } = req.body;
    const updateData = {
      title,
      description,
      address,
      date
    };
    if (req.file) {
      updateData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }
    const event = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!event) {
      return res.status(404).json({
        status: false,
        responseCode: 404,
        message: "Event not found"
      });
    }
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Event updated successfully!",
      data: {
        _id: event._id,
        title: event.title,
        description: event.description,
        address: event.address,
        date: event.date,
        imageUrl: `/api/event/${event._id}`
      }
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message
    });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({
        status: false,
        responseCode: 404,
        message: "Event not found"
      });
    }
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Event deleted successfully!"
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message
    });
  }
};

// Get Event Image
exports.getEventImage = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event || !event.image || !event.image.data) {
      return res.status(404).json({
        status: false,
        responseCode: 404,
        message: "Image not found"
      });
    }
    res.set('Content-Type', event.image.contentType);
    res.send(event.image.data);
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message
    });
  }
};