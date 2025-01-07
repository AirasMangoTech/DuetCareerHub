const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  department: String,
  rollNumber: String,
  cgpa: String,
  contactNumber: String,
  programYear: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: String,
  resume: String,
  portfolioURL: String,
  socialLinks: {
    linkedIn: String,
    github: String,
  },
  achievements: [String],
  skills: [String],
  certifications: [String]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);