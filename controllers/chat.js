const { default: mongoose } = require("mongoose");
const chat = require("../models/chat");
const { userData, paginateData } = require("../utils/helper");

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
      message,
      seen: req.io.sockets.adapter.rooms.get(receiver) ? true : false,
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

exports.msgHistory = async (req, res) => {
  const { sender, receiver } = req.params;
  const { page, limit } = req.query;
  try {
    let query = {
      $or: [
        { sender: sender, receiver: receiver },
        { sender: receiver, receiver: sender },
      ],
    };
    // Mark all messages sent to the receiver by the sender as seen
    await chat.updateMany(
      { sender: sender, receiver: receiver, seen: false },
      { $set: { seen: true } }
    );
    const populateOptions = [
      {
        path: "sender",
        select: "profileImage name lastName email",
      },
      {
        path: "receiver",
        select: "profileImage name lastName email",
      },
    ];
    const history = await paginateData(
      chat,
      page,
      limit,
      query,
      "-__v",
      populateOptions,
      true
    ); // sort by time (oldest to newest)

    res.status(200).json(history);
  } catch (error) {
    console.error("Error getting message history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.msgList = async (req, res) => {
  const userId = new mongoose.Types.ObjectId("684c68eff5b4990e3b30b815");

  try {
    const chats = await chat.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      { $sort: { createdAt: -1 } },

      // Group by conversation partner
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"],
          },
          lastMessage: { $first: "$message" },
          createdAt: { $first: "$createdAt" },
          role: {
            $first: {
              $cond: [
                { $eq: ["$sender", userId] },
                "$receiverRole",
                "$senderRole",
              ],
            },
          },
        },
      },

      // Lookup from User
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDataUser",
        },
      },
      // Lookup from Alumni
      {
        $lookup: {
          from: "alumnis",
          localField: "_id",
          foreignField: "_id",
          as: "userDataAlumni",
        },
      },
      // Lookup from Faculty
      {
        $lookup: {
          from: "faculties",
          localField: "_id",
          foreignField: "_id",
          as: "userDataFaculty",
        },
      },

      // Merge the correct one based on role
      {
        $addFields: {
          user: {
            $cond: [
              { $eq: ["$role", "User"] },
              { $arrayElemAt: ["$userDataUser", 0] },
              {
                $cond: [
                  { $eq: ["$role", "Alumni"] },
                  { $arrayElemAt: ["$userDataAlumni", 0] },
                  { $arrayElemAt: ["$userDataFaculty", 0] },
                ],
              },
            ],
          },
        },
      },

      {
        $project: {
          _id: 1,
          lastMessage: 1,
          createdAt: 1,
          name: "$user.name",
          lastName: { $ifNull: ["$user.lastName", "$user.lastname"] },
          profileImage: "$user.profilePicture",
        },
      },
    ]);

    // 🔢 Get unread count for each sender
    const unreadCounts = await chat.aggregate([
      {
        $match: {
          receiver: userId,
          seen: false,
        },
      },
      {
        $group: {
          _id: "$sender",
          count: { $sum: 1 },
        },
      },
    ]);

    const unreadMap = {};
    unreadCounts.forEach((item) => {
      unreadMap[item._id.toString()] = item.count;
    });

    const finalList = chats.map((chat) => ({
      receiverId: chat._id,
      name: chat.name,
      lastName: chat.lastName,
      profileImage: chat.profileImage,
      lastMessage: chat.lastMessage,
      createdAt: chat.createdAt,
      unreadCount: unreadMap[chat._id.toString()] || 0,
    }));

    res.status(200).json({ data: finalList });
  } catch (error) {
    console.error("Error fetching message list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
