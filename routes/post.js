const express = require("express");
const { verifyToken } = require("../middlewares/tokenVerify");
const { getPost } = require("../controllers/post");
const router = express.Router();

router.post("/", verifyToken, addPost);
router.get("/", verifyToken, getPost);

module.exports = router;
