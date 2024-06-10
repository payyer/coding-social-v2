const userModel = require("../model/user.model")
const friendRequestModel = require('../model/friendRequest')
const { addFriendService } = require("../service/user.service")
const { removeVietnameseTones } = require("../utils/createVerifyCode")

const getFriendList = async (req, res) => {
    const userId = req.user.userId
    const userName = req.query.userName || "all"
    try {
        const friendList = await userModel.findById(userId)
            .select({ user_list_friend: 1, _id: 0 })
            .populate({
                path: 'user_list_friend', select: "user_name user_avatar",
                match: userName !== 'all' ? { user_name: { $regex: userName, $options: 'i' } } : null // Apply the filter here
            })
            .lean()
        return res.status(200).json({
            message: "Get friend list thành công",
            metadata: friendList.user_list_friend
        })
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            metadata: error.message
        })
    }
}

const acceptFriendRequest = async (req, res) => {
    const userId = req.user.userId
    const { senderId } = req.body

    try {
        await addFriendService(userId, senderId)

        await friendRequestModel.deleteMany({ sender_id: senderId, receiver_id: userId })

        return res.status(200).json({
            message: "Chấp nhận lời mời kết bạn thành công"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            metadata: error.message
        })
    }
}

const searchUser = async (req, res) => {
    const { userName } = req.query
    const userId = req.user.userId
    const nameNoTones = await removeVietnameseTones(userName)

    const page = parseInt(req.query.page) || 1; // Lấy trang hiện tại từ query, mặc định là 1
    const limit = parseInt(req.query.limit) || 5; // Lấy số lượng kết quả mỗi trang, mặc định là 5
    const skip = (page - 1) * limit; // Tính toán số lượng kết quả cần bỏ qua
    try {
        const users = await userModel.find({ user_name_no_tones: { $regex: nameNoTones, $options: 'i' } })
            .select('_id user_name user_avatar user_list_friend')
            .limit(limit)
            .skip(skip)
            .lean()

        const updateUser = await Promise.all(users.map(async user => {
            const listFriendId = user.user_list_friend.map(item => item.toString())
            const isFriend = listFriendId.includes(userId)

            // Này là để kiểm tra có đang gửi FR cho người ta không!
            const isRequest = await friendRequestModel.find({ sender_id: userId, receiver_id: user._id })

            const { user_list_friend, ...userWithoutFriends } = user;
            return {
                ...userWithoutFriends,
                isFriend,
                isRequest: isRequest.length > 0
            }
        }))


        return res.status(200).json({
            message: "Danh sách tìm kiếm",
            metadata: updateUser,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            metadata: error.message
        })
    }

}

module.exports = {
    acceptFriendRequest, getFriendList, searchUser
}