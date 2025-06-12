const express = require("express");

const { verifyToken } = require("../middlewares/tokenVerify");
const { createJob, updateJob, deleteJob, myJobs, Jobs } = require("../controllers/job");
 

const router = express.Router();

router.post("/", verifyToken, createJob);
router.put("/:id", verifyToken, updateJob);
router.delete("/:id", verifyToken, deleteJob);
router.get("/my-jobs", verifyToken, myJobs);
router.get("/",      Jobs);
// resume jobs



module.exports = router;
