const Event = require('../models/Event');
const express = require('express');
const eventController = require('./eventController');
// Create Event
exports.createEvent = async (req, res) => {
    try {
        const { image, title, description, address, date } = req.body;
        const event = new Event({ image, title, description, address, date });
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
        const { image, title, description, address, date } = req.body;
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { image, title, description, address, date },
            { new: true }
        );
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

