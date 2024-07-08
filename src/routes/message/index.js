const express = require("express");
const { checkAuth } = require("../../auth/authentication");
const { getMessages, createMessage } = require("../../controller/message.controller");
const router = express.Router();

router.use(checkAuth);

router.get("/:chatRoomId", getMessages);
router.post("/", createMessage);

module.exports = router;
