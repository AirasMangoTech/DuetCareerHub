const Message = require('../models/Message');

// Save a new message
exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newMessage = new Message({ senderId, receiverId, content });
    await newMessage.save();

    res.status(201).json({ message: 'Message sent successfully.', newMessage });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message.', error });
  }
};

// Get conversation history
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: conversationId },
        { receiverId: conversationId }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving messages.', error });
  }
};
