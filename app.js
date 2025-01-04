
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const http = require('http');
const initializeSocket = require('./config/socket');
const connectDB = require('./config/db');

dotenv.config(); 
const app = express();
const server = http.createServer(app);
// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

connectDB();
// Use cookie-parser middleware
app.use(cookieParser());
// MongoDB connection setup

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
initializeSocket(server);

module.exports = app;
