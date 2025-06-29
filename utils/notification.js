// helpers/sendNotification.js

const Notification = require("../models/notification");

const sendNotification = async ({
  req,
  title,
  description,
  receiverIds = [],
}) => {
  const io = req.io;


  if (!io) {
    console.error("Socket.io not available in request");
    return;
  }

  const notifications = receiverIds.map((data) => ({
    title,
    description,
    receiverId: data._id,
    creator: data.role,
    type: "general",
  }));

  // Save all in DB
  const savedNotifications = await Notification.insertMany(notifications);

  // Emit to each receiver
  receiverIds.forEach((data) => {
    const myNotifications = savedNotifications.find(
      (notification) =>
        notification.receiverId.toString() === data?._id.toString()
    );

    io.to(data?._id.toString()).emit("notification", myNotifications);
  });

  console.log("🔔 General notifications sent & saved.");
  return savedNotifications;
};

module.exports = sendNotification;
