const express = require("express");
const upload = require("../middlewares/fileUpload");
const { postUpload } = require("../controllers/uploadController");
const router = express.Router();

router.post("/upload", upload.single("document"), postUpload);

module.exports = router;
