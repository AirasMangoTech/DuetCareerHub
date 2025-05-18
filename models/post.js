const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    imageDesc: String,
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", postSchema);
