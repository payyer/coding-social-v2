const express = require("express");
const { checkAuth } = require("../../auth/authentication");
const {
   findChatRoom,
   createChatRoom,
   getAllChatRoomOfUser,
} = require("../../controller/chatRoom.controller");
const router = express.Router();

router.use(checkAuth);

router.get("/", findChatRoom);
router.post("/", createChatRoom);
router.get("/getAllChatRoomOfUser", getAllChatRoomOfUser);

module.exports = router;
