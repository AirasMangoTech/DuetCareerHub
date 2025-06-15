const Announcement = require("../models/Announcement");
const { paginateData, getAllReceiverIds, userData } = require("../utils/helper");
const sendNotification = require("../utils/notification");

// Create Announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const findUser = await userData(user?._id, "name");

    const announcement = new Announcement({ title, description, date });
    getAllReceiverIds()
      .then((receivers) => {
        sendNotification({
          req,
          title: "Admin Announced A New Announcement",
          description,
          receiverIds: receivers,
        }).catch((err) => console.error("Notification error:", err));
      })
      .catch((err) => console.error("Receiver fetch error:", err));
    await announcement.save();
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Announcement created successfully!",
      data: announcement,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message,
    });
  }
};

// Get All Announcements
exports.getAnnouncements = async (req, res) => {
  const { page, limit } = req.query;
  try {
    const announcements = await paginateData(Announcement, page, limit, {});

    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Announcements fetched successfully!",
      data: announcements,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message,
    });
  }
};

// Get Announcement by ID
exports.getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({
        status: false,
        responseCode: 404,
        message: "Announcement not found",
      });
    }
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Announcement fetched successfully!",
      data: announcement,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message,
    });
  }
};

// Update Announcement
exports.updateAnnouncement = async (req, res) => {
  try {
    const { title, description } = req.body;
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    if (!announcement) {
      return res.status(404).json({
        status: false,
        responseCode: 404,
        message: "Announcement not found",
      });
    }
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Announcement updated successfully!",
      data: announcement,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message,
    });
  }
};

// Delete Announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({
        status: false,
        responseCode: 404,
        message: "Announcement not found",
      });
    }
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Announcement deleted successfully!",
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message,
    });
  }
};
