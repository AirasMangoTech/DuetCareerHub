const chat = require("../models/chat");
const { userData } = require("../utils/helper");

exports.sendMessage = async (req, res) => {
  const { receiver, receiverRole, message } = req.body;
  const { _id: senderId, role: senderRole } = req.user;
  if (!receiver || !receiverRole || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const senderData = await userData(req.user._id, req.user.role);
    const newMessage = {
      sender: senderId,
      senderRole: senderRole.charAt(0).toUpperCase() + senderRole.slice(1),
      receiver,
      receiverRole:
        receiverRole.charAt(0).toUpperCase() + receiverRole.slice(1),
      content: message,
      seen: false,
      createdAt: new Date(),
    };

    const savedMessage = await chat.create(newMessage);
    req.io.to(receiver.toString()).emit("newMessage", savedMessage);
    req.io.to(receiver.toString()).emit("notification", {
      title: "New Message",
      description: `You have a new message from ${senderData?.name || senderRole}`,
    });

    res.status(201).json({
      status: true,
      message: "Message sent successfully",
      data: newMessage, // or savedMessage if using a database
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
