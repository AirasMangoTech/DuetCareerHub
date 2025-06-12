const notification = require("../models/notification");
const { paginateData } = require("../utils/helper");
const sendNotification = require("../utils/notification");

exports.addNotification = async (req, res) => {
  const { title, description, receiverId } = req.body;
  try {
    const savedNotifications = await sendNotification({
      req,
      title,
      description,
      receiverIds: Array.isArray(receiverId) ? receiverId : [receiverId],
    });
    res.status(200).send({
      message: "Notifications sent successfully",
      notifications: savedNotifications,
    });
  } catch (error) {
    console.error("Error in notification route:", error);
    res.status(500).send({ message: error.message });
  }
};

exports.getNotification = async (req, res) => {
  const user = req.user._id;
  const { page = 1, limit = 10 } = req.query;
  try {
    let query = { receiverId: user };

    const result = await paginateData(notification, page, limit, query, "-__v");
    res.send(result);
  } catch (error) {
    console.error("Error in notification route:", error);
    res.status(500).send({ message: error.message });
  }
};
exports.getNotificationById = async (req, res) => {
  const user = req.user._id;
  const { id } = req.params;
  try {
    const result = await notification.findById(id);
    res.send({ data: result });
  } catch (error) {
    console.error("Error in notification route:", error);
    res.status(500).send({ message: error.message });
  }
};
exports.deleteNotification = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await notification.findByIdAndDelete(id);
    res.send({ data: result, message: "Notification Delete" });
  } catch (error) {
    console.error("Error in notification route:", error);
    res.status(500).send({ message: error.message });
  }
};
