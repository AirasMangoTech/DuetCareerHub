const User = require('../models/User');
// Create User (Registration)
exports.createUser = async (req, res) => {
  try {
    const { name, lastName, department, rollNumber, cgpa, contactNumber, programYear, email, password } = req.body;
    const user = new User({ name, lastName, department, rollNumber, cgpa, contactNumber, programYear, email, password });
    await user.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Email already exists." });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Read User (Get Profile by ID)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found!" });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Update User (Edit Profile)
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found!" });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found!" });
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};