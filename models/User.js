const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true }, // Single ObjectId
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
  resume: {
    data: Buffer,
    contentType: String
  },
  portfolioURL: String,
  socialLinks: {
    linkedIn: String,
    github: String,
  },
  achievements: [String],
  skills: [String],
  certifications: [String],
  otp: {
    type: String,
    required: false
  },
  otpExpires: {
    type: Date,
    required: false
  },
  role: { type: String, default: 'user' }
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