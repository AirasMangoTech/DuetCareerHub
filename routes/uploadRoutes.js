const express = require("express");
const upload = require("../middlewares/fileUpload");
const { postUpload } = require("../controllers/uploadController");
const router = express.Router();

router.post("/upload", upload.fields([
  { name: "document", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]), postUpload);

module.exports = router;
