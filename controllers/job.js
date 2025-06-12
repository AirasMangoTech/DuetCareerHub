const job = require("../models/job");
const Resume = require("../models/Resume");
const { paginateData } = require("../utils/helper");
const { OpenAI } = require("openai");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const getSkillsFromJobTitle = async (jobTitle) => {
  const prompt = `Extract the core technical skills required for this job title: "${jobTitle}". Return the skills as a JavaScript array like ["html", "css", "javascript"].`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  try {
    // Try parsing the array if response is JSON-like
    const text = response.choices[0].message.content.trim();
    const skills = JSON.parse(text);
    return skills.map((s) => s.toLowerCase());
  } catch (err) {
    console.error("Error parsing OpenAI response:", err.message);
    return [];
  }
};

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

exports.Jobs = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const populateOptions = [
      {
        path: "user",
      },
    ];

    const myJobs = await paginateData(
      job,
      page,
      limit,
      {},
      null,
      populateOptions
    );

    res.send(myJobs);
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message,
    });
  }
};

exports.resumeJobs = async (req, res) => {
  const { jobTitle } = req.params;
  try {
    const inferredSkills = await getSkillsFromJobTitle(jobTitle); // OpenAI call
    console.log(inferredSkills, " ← extracted skills");

    const resumes = await Resume.find({});
    const matchedResumes = resumes.filter((resume) => {
  const skills = resume.educationalBackground.skills.map((skill) =>
    skill.toLowerCase()
  );

  return inferredSkills.some((keyword) => {
    const keywordPattern = new RegExp(keyword.toLowerCase().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')); // escape regex special characters
    return skills.some((skill) => keywordPattern.test(skill));
  });
});


    res.status(200).json({
      status: true,
      responseCode: 200,
      matchedResumes,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message,
    });
  }
};


