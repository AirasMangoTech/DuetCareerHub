const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "senderRole",
  },
  senderRole: {
    type: String,
    enum: ["Faculty", "Alumni", "User"],
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    refPath: "receiverRole",
  },
  receiverRole: {
    type: String,
    enum: ["Faculty", "Alumni", "User"],
  },
  message: {
    type: String,
    required: true,
  },  

  seen: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Chat", chatSchema);
