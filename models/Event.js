const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  image: {
    data: Buffer,
    contentType: String
  },
  title: String,
  address: String
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);