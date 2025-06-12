const express = require("express");
const {
  addNotification,
  getNotification,
  getNotificationById,
  deleteNotification,
} = require("../controllers/notification");
const { verifyToken } = require("../middlewares/tokenVerify");
const router = express.Router();

router.post("/", addNotification);
router.get("/", verifyToken, getNotification);
router.get("/:id", verifyToken, getNotificationById);
router.delete("/:id", verifyToken, deleteNotification);

module.exports = router;
