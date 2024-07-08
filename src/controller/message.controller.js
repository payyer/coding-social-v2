const messageModel = require("../model/message.model");

const createMessage = async (req, res) => {
   const senderId = req.user.userId;
   const { chatRoomId, text } = req.body
   try {
      const newMessage = await messageModel.create({ chatRoomId, text, senderId })
      if (!newMessage) return res.status(400).json({ message: "Send message failed" })
      return res.status(200).json({
         message: "Sent message successfully!",
         metadata: newMessage
      });
   } catch (error) {
      return res.status(500).json({
         message: "Lỗi server",
         metadata: error.message,
      });
   }
};
const getMessages = async (req, res) => {
   const chatRoomId = req.params.chatRoomId
   try {
      const foundMessage = await messageModel.find({ chatRoomId }).lean()
      if (!foundMessage) return res.status(401).json({ message: "Didn't found any chat room" })
      return res.status(200).json({
         message: "Get message successfully!",
         metadata: foundMessage,
      });
   } catch (error) {
      return res.status(500).json({
         message: "Lỗi server",
         metadata: error.message,
      });
   }
}
module.exports = {
   createMessage, getMessages
};
