const chatRoomModal = require('../model/chatRoom')
// createChatRoom
// getAllChatRoomUser
// findChat

const createChatRoom = async (req, res) => {
    const currentUserId = req.user.userId
    const { secondUserId } = req.body
    try {
        const foundChatRoom = await chatRoomModal.findOne({
            members: { $all: [currentUserId, secondUserId] }
        }).lean()
        if (foundChatRoom) return res.status(200).json({
            message: "ChatRoom đã tồn tại",
            metadata: foundChatRoom
        })

        const newChatRoom = await chatRoomModal.create({
            members: [currentUserId, secondUserId]
        })

        return res.status(200).json({
            message: "Tạo mới Chat Room thành công",
            metadata: newChatRoom
        })
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            metadata: error.message
        })
    }
}

const findChatRoom = async (req, res) => {
    const currentUserId = req.user.userId
    const { secondUserId } = req.body
    try {
        const foundChatRoom = await chatRoomModal.findOne({
            members: { $all: [currentUserId, secondUserId] }
        }).lean()
        if (foundChatRoom) return res.status(200).json({
            message: "Tìm ChatRoom thành công",
            metadata: foundChatRoom
        })
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            metadata: error.message
        })
    }
}

module.exports = {
    createChatRoom,
    findChatRoom
}