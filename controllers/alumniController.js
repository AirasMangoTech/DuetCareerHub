const Alumni = require('../models/Alumni');
// Create Alumni (Register)
exports.createAlumni = async (req, res) => {
  try {
    const { name, lastName, department, rollNumber, graduationYear, degree, currentJobTitle, companyName, contactNumber, email } = req.body;
    const alumni = new Alumni({ name, lastName, department, rollNumber, graduationYear, degree, currentJobTitle, companyName, contactNumber, email });
    await alumni.save();
    res.status(201).json({ message: "Alumni created successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Get All Alumni
exports.getAllAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.find();
    res.status(200).json(alumni);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Read Alumni (Get Alumni by ID)
exports.getAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    if (!alumni) return res.status(404).json({ message: "Alumni not found!" });
    res.status(200).json(alumni);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Alumni
exports.updateAlumni = async (req, res) => {
  try {
    const updatedAlumni = await Alumni.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAlumni) return res.status(404).json({ message: "Alumni not found!" });
    res.status(200).json(updatedAlumni);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Delete Alumni
exports.deleteAlumni = async (req, res) => {
  try {
    const deletedAlumni = await Alumni.findByIdAndDelete(req.params.id);
    if (!deletedAlumni) return res.status(404).json({ message: "Alumni not found!" });
    res.status(200).json({ message: "Alumni deleted successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
