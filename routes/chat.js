const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat");
const { verifyToken } = require("../middlewares/tokenVerify");

router.post("/", verifyToken, chatController.sendMessage);
router.get(
  "/history/:sender/:receiver",
  verifyToken,
  chatController.msgHistory
);
router.get("/list", verifyToken, chatController.msgList);
module.exports = router;
