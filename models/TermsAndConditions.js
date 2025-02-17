const mongoose = require('mongoose');

const termsAndConditionsSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('TermsAndConditions', termsAndConditionsSchema);