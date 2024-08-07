const friendRequestModel = require("../model/friendRequest")

const getFriendRequestList = async (req, res) => {
    const userId = req.user.userId
    try {
        const friendRequestList = await friendRequestModel.find({ receiver_id: userId })
            .select('sender_id')
            .populate({
                path: 'sender_id', select: "user_name user_avatar",
            }).lean()

        return res.status(200).json({
            message: "Lấy danh sách friend request thành công",
            metadata: friendRequestList
        })
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            metadata: error.message
        })
    }
}

const sendFriendRequest = async (req, res) => {
    const userId = req.user.userId
    const { receiverId } = req.body
    try {
        const newFriendRequest = await friendRequestModel.create({ sender_id: userId, receiver_id: receiverId })
        return res.status(200).json({
            message: "Gửi lời mới kết bạn thành công",
            meatadata: newFriendRequest
        })
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            meatadata: error.message
        })
    }
}

const deleteFriendRequest = async (req, res) => {
    const userId = req.user.userId
    const { receiverId } = req.body
    try {
        await friendRequestModel.deleteOne({ sender_id: userId, receiver_id: receiverId })
        return res.status(200).json({
            message: "Hủy yêu cầu kết bạn thành công",
        })
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            meatadata: error.message
        })
    }
}

module.exports = { getFriendRequestList, sendFriendRequest, deleteFriendRequest }