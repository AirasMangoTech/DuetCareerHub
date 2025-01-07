const Admin = require('../models/Admin');
//Create Admin (Register)
exports.createAdmin = async (req, res) => {
  try {
    const { name, lastName, department, designation, qualification, contactNumber, email, password } = req.body;
    const admin = new Admin({ name, lastName, department, designation, qualification, contactNumber, email, password });
    await admin.save();
    res.status(201).json({ message: "Admin created successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Get All Admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Read Admin (Get Admin by ID)
exports.getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found!" });
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Update Admin
exports.updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAdmin) return res.status(404).json({ message: "Admin not found!" });
    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Delete Admin
exports.deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) return res.status(404).json({ message: "Admin not found!" });
    res.status(200).json({ message: "Admin deleted successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
