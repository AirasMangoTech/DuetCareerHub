const Report = require('../models/Report');
const User = require('../models/User');

// Create Report
exports.createReport = async (req, res) => {
  try {
    const { userId, message } = req.body;
    const report = new Report({ userId, message });
    await report.save();
    res.status(201).json({ message: "Report created successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Reports
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('userId', 'name email');
    res.status(200).json(reports);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Suspend User
exports.suspendUser = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: "Report not found!" });

    const user = await User.findById(report.userId);
    if (!user) return res.status(404).json({ message: "User not found!" });

    // Suspend user logic
    user.suspended = true;
    await user.save();

    report.status = 'suspended';
    await report.save();

    res.status(200).json({ message: "User suspended successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Unsuspend User
exports.unsuspendUser = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: "Report not found!" });

    const user = await User.findById(report.userId);
    if (!user) return res.status(404).json({ message: "User not found!" });

    // Unsuspend user logic
    user.suspended = false;
    await user.save();

    report.status = 'unsuspended';
    await report.save();

    res.status(200).json({ message: "User unsuspended successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
