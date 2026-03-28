const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const { chatbotHandler } = require("../controllers/chatbotController");
router.post("/", authMiddleware,chatbotHandler);

module.exports = router;