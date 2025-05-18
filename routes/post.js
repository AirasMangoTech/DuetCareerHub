const express = require("express");
const { verifyToken } = require("../middlewares/tokenVerify");
const {
  getPost,
  addPost,
  getPostById,
  updatePost,
  deletePost,
  getmyPost,
} = require("../controllers/post");
const router = express.Router();

router.post("/", verifyToken, addPost);
router.get("/", verifyToken, getPost);
router.get("/my-posts", verifyToken, getmyPost);
router.get("/:id", verifyToken, getPostById);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

module.exports = router;
