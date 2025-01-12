const Event = require('../models/Event');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
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
    res.status(201).json({ message: "Event created successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Get Event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event updated successfully!", event });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Middleware to handle file upload
exports.uploadImage = upload.single('image');