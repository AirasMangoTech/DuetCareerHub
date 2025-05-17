const Alumni = require("../models/Alumni");
const User = require("../models/User");
const Faculty = require("../models/Faculty");
const Announcement = require("../models/Announcement");
const Event = require("../models/Event");
const { paginateData } = require("../utils/helper");

exports.getStats = async (req, res) => {
  try {
    const totalAlumni = await Alumni.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalFaculty = await Faculty.countDocuments();

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    startDate.setDate(1);
    const endDate = new Date();
    endDate.setDate(1);

    const totalAlumniLastMonth = await Alumni.countDocuments({
      createdAt: { $gte: startDate, $lt: endDate },
    });
    const totalUsersLastMonth = await User.countDocuments({
      createdAt: { $gte: startDate, $lt: endDate },
    });
    const totalFacultyLastMonth = await Faculty.countDocuments({
      createdAt: { $gte: startDate, $lt: endDate },
    });

    const latestAnnouncements = await Announcement.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("-__v");

    const latestEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select("-__v");

    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Statistics fetched successfully!",
      data: {
        totalAlumni,
        totalAlumniLastMonth,
        totalUsers,
        totalUsersLastMonth,
        totalFaculty,
        totalFacultyLastMonth,
        latestAnnouncements,
        latestEvents,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      responseCode: 500,
      message: error.message,
    });
  }
};

exports.getHome = async (req, res) => {
  const { page, limit } = req.query;
  try {
    let query = { profilePicture: { $exists: true } };
    const populateOpt = [
      {
        path: "department",
        select: "name",
      },
    ];
    const faculty = await paginateData(
      Faculty,
      page,
      limit,
      query,
      "-password",
      populateOpt
    );
    const users = await paginateData(
      User,
      page,
      limit,
      query,
      "-password",
      populateOpt
    );
    res.json({
      faculty: faculty.data,
      users: users.data,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: false,
      responseCode: 500,
      message: error.message,
    });
  }
};
