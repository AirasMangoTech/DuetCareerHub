const mongoose = require('mongoose');

const termsAndConditionsSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  text: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('TermsAndConditions', termsAndConditionsSchema);