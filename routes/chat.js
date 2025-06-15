const express = require("express"); 
const router = express.Router();
const  chatController = require("../controllers/chat");
const { verifyToken } = require("../middlewares/tokenVerify");



router.post("/",verifyToken, chatController.sendMessage);



module.exports= router