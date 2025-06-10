const express = require("express");
const {
  createJob,
  updateJob,
  deleteJob,
  myJobs,
  Jobs,
  resumeJobs,
} = require("../controllers/job");
const { verifyToken } = require("../middlewares/tokenVerify");

const router = express.Router();

router.post("/", verifyToken, createJob);
router.put("/:id", verifyToken, updateJob);
router.delete("/:id", verifyToken, deleteJob);
router.get("/my-jobs", verifyToken, myJobs);
router.get("/",Jobs);



// resume jobs

router.get("/resume-jobs/:jobTitle", verifyToken, resumeJobs);



module.exports = router;
