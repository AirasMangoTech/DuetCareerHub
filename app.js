const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const adminRoutes = require('./routes/adminRoutes');
const alumniRoutes = require('./routes/alumniRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const userRoutes = require('./routes/userRoutes');
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

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3003',
    credentials: true
}));

app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

connectDB();

// Use cookie-parser middleware
app.use(cookieParser());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/user', userRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/home', homePageRoutes);
app.use('/api/about', aboutPageRoutes);
app.use('/api/terms-and-conditions', termsAndConditionsRoutes);

module.exports = app;