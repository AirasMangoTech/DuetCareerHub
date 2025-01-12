const mongoose = require('mongoose');

const homePageSchema = new mongoose.Schema({
  bannerImage: {
    data: Buffer,
    contentType: String
  },
  bannerText: String
}, { timestamps: true });

module.exports = mongoose.model('HomePage', homePageSchema);