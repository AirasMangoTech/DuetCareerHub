
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const adminRoutes = require('./routes/adminRoutes');
const alumniRoutes = require('./routes/alumniRoutes');
const userRoutes = require('./routes/userRoutes')
const announcementRoutes = require('./routes/announcementRoutes');
const eventRoutes = require('./routes/eventRoutes');
const reportRoutes = require('./routes/reportRoutes');
const connectDB = require('./config/db');

dotenv.config(); 
const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

connectDB();
// Use cookie-parser middleware
app.use(cookieParser());
// MongoDB connection setup

// Auth routes

app.use('/api/admin', adminRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/user', userRoutes);
app.use('/announcements', announcementRoutes);
app.use('/events', eventRoutes);
app.use('/reports', reportRoutes);

module.exports = app;
