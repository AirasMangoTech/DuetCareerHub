const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const adminRoutes = require('./routes/adminRoutes');
const alumniRoutes = require('./routes/alumniRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const userRoutes = require('./routes/userRoutes')
const announcementRoutes = require('./routes/announcementRoutes');
const eventRoutes = require('./routes/eventRoutes');
const reportRoutes = require('./routes/reportRoutes');
const homePageRoutes = require('./routes/homePageRoutes');
const aboutPageRoutes = require('./routes/aboutPageRoutes');
const termsAndConditionsRoutes = require('./routes/termsAndConditionsRoutes');
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

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/user', userRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/announcements', announcementRoutes);
app.use('/events', eventRoutes);
app.use('/reports', reportRoutes);
app.use('/home', homePageRoutes);
app.use('/api/about', aboutPageRoutes);
app.use('/api/terms-and-conditions', termsAndConditionsRoutes);

module.exports = app;
