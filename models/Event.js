const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  image: String,
  title: String,
  description: String,
  address: String,
  date: Date
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);