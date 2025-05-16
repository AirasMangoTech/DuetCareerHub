const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: Date,
    // ...other fields...
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
