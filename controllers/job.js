const job = require("../models/job");
const { paginateData } = require("../utils/helper");

exports.createJob = async (req, res) => {
  const user = req.user;

  try {
    const createJob = await job.create({
      ...req.body,
      user: user?._id,
      creator: user?.role.charAt(0).toUpperCase() + user?.role.slice(1),
    });
    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Job created successfully!",
      data: createJob,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message,
    });
  }
};

exports.updateJob = async (req, res) => {
  const user = req.user;
  const jobId = req.params.id;

  try {
    const updatedJob = await job.findOneAndUpdate(
      { _id: jobId, user: user?._id },
      {
        ...req.body,
        creator: user?.role.charAt(0).toUpperCase() + user?.role.slice(1),
      },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({
        status: false,
        responseCode: 404,
        message: "Job not found or not authorized to update.",
      });
    }

    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Job updated successfully!",
      data: updatedJob,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message,
    });
  }
};
exports.deleteJob = async (req, res) => {
  const user = req.user;
  const jobId = req.params.id;

  try {
    const deletedJob = await job.findOneAndDelete({
      _id: jobId,
      user: user?._id,
    });

    if (!deletedJob) {
      return res.status(404).json({
        status: false,
        responseCode: 404,
        message: "Job not found or not authorized to delete.",
      });
    }

    res.status(200).json({
      status: true,
      responseCode: 200,
      message: "Job deleted successfully!",
      data: deletedJob,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message,
    });
  }
};

exports.myJobs = async (req, res) => {
  const user = req.user._id;
  const { page = 1, limit = 10 } = req.query;
  try {
    const myJobs = await paginateData(job, page, limit, { user });

    res.send(myJobs);
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message,
    });
  }
};
