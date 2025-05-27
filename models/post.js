const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "creator",
    },
    creator: {
      type: String,
      enum: ["User", "Faculty", "Alumni"],
    },
    image: String,
    title: String,
    imageDesc: String,
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", postSchema);
