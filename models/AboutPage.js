const mongoose = require('mongoose');

const aboutPageSchema = new mongoose.Schema({
  missionStatement: String,
  platformOverview: String
}, { timestamps: true });

module.exports = mongoose.model('AboutPage', aboutPageSchema);