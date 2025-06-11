// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: String,
  description: String,
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "creator",
  },

  creator: {
    type: String,
    enum: ["Faculty", "Alumni", "User"],
  },
  type: {
    type: String, // e.g., 'general', 'chat'
    default: "general",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
