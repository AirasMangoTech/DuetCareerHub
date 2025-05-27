const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "creator",
  },
  creator: {
    type: String,
    enum: ["Faculty", "Alumni"],
  },
  name: {
    type: String,
    required: true,
  },
  companyname: {
    type: String,
    required: true,
  },
  timing: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: String,
    required: true,
  },
},{timestamps:true  });

module.exports = mongoose.model("Job", jobSchema);
