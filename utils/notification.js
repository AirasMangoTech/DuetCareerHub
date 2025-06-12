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

  const notifications = receiverIds.map((id) => ({
    title,
    description,
    receiverId: id,
    type: "general",
  }));
  

  // Save all in DB
  const savedNotifications = await Notification.insertMany(notifications);

  // Emit to each receiver
  receiverIds.forEach((id) => {
    console.log(id.toString(),"<id.toString()");
    
    io.to(id.toString()).emit("notification", {
      title,
      description,
      receiverId: id,
    });
  });

  console.log("🔔 General notifications sent & saved.");
  return savedNotifications;
};

module.exports = sendNotification;
