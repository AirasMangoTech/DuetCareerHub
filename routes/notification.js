const express = require("express");
const sendNotification = require("../utils/notification");
const router = express.Router();

router.post("/", async (req, res) => {
  const { title, description, receiverId } = req.body;
  try {
    const savedNotifications = await sendNotification({
      req,
      title,
      description,
      receiverId: Array.isArray(receiverId) ? receiverId : [receiverId],
    });
    console.log(savedNotifications);
    res.status(200).json({
      message: "Notifications sent successfully",
      notifications: savedNotifications,
    });
  } catch (error) {
    console.error("Error in notification route:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
