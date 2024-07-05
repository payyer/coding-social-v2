const userModel = require("../model/user.model")
const friendRequestModel = require('../model/friendRequest')
const { addFriendService, unfriendService } = require("../service/user.service")
const { removeVietnameseTones } = require("../utils/createVerifyCode")
const cloudinary = require('../utils/cloudinary')

const getUserInfo = async (req, res) => {
    const userId = req.params.userId
    try {
        const userInfo = await userModel.findById(userId)
            .select({
                user_name_no_tones: 0,
                user_roles: 0,
                user_password: 0,
                user_verify: 0,
                email_verify_token: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0
            })
            .lean()
        return res.status(200).json({
            metadata: userInfo
        })
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            metadata: error.message
        })
    }

}

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

const rejectFriendRequest = async (req, res) => {
    const userId = req.user.userId
    const { senderId } = req.body

    try {
        await friendRequestModel.deleteMany({ sender_id: senderId, receiver_id: userId })
        return res.status(200).json({
            message: "Từ chối kết bạn thành công"
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

const updateUserInfo = async (req, res) => {
    const userId = req.user.userId
    const { user_name, user_bio, user_birthday, user_country, user_display_settings } = req.body
    const files = req.files // Cv để update => file
    console.log([{ files }])
    try {
        // TODO: Đã update các file bình thường, còn up file cv lên clound nữa là xog
        // TODO: Check CV file on Clound to delete old file and add new file upload
        const foundUserAndUpdate = await userModel.findByIdAndUpdate(userId,
            {
                user_name,
                user_bio,
                user_birthday,
                user_country,
                user_display_settings
            },
            { new: true })
            .select({ createdAt: 0, updatedAt: 0, email_verify_token: 0, user_verify: 0, user_list_friend: 0, user_roles: 0, "__v": 0 })

        if (!foundUserAndUpdate) throw res.status(401).json({ message: "Không tìm thấy người dùng" })

        if (foundUserAndUpdate.user_cv.public_id) {
            cloudinary.uploader.destroy(foundUserAndUpdate.user_cv.public_id)
                .then(result => console.log("Delete image on cloud", result))
                .catch(error => console.log("Delete Image Error", error))
        }

        const media = await cloudinary.uploader.upload(files[0].path, {
            folder: 'SocialMedia'
        })

        foundUserAndUpdate.user_cv = {
            public_id: media.public_id,
            url: media.secure_url
        }
        await foundUserAndUpdate.save()


        return res.status(200).json({
            message: "Cập nhật người dùng thành công",
            metadata: foundUserAndUpdate
        })
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi hệ thống",
            meatadata: error.message
        })
    }
}

const updateUserAvatar = async (req, res) => {
    const userId = req.user.userId
    const file = req.file
    try {
        const foundUser = await userModel.findById(userId)
        if (!foundUser) throw res.status(401).json({ message: "Không tìm thấy người dùng" })

        if (foundUser.user_avatar.public_id) {
            cloudinary.uploader.destroy(foundUser.user_avatar.public_id)
                .then(result => console.log("Delete image on cloud", result))
                .catch(error => console.log("Delete Image Error", error))
        }

        const newAvatar = await cloudinary.uploader.upload(file.path, {
            folder: 'SocialMedia'
        })

        foundUser.user_avatar = {
            public_id: newAvatar.public_id,
            url: newAvatar.secure_url,
        }
        await foundUser.save()
        return res.status(200).json({
            message: "Cập nhật Avatar thành công",
            meatadata: foundUser
        })

    } catch (error) {
        return res.status(500).json({
            message: "Lỗi hệ thống",
            meatadata: error.message
        })
    }

}

const updateUserCoverImage = async (req, res) => {
    const userId = req.user.userId
    const file = req.file

    try {
        const foundUser = await userModel.findById(userId)
        if (!foundUser) throw res.status(401).json({ message: "Không tìm thấy người dùng" })

        if (foundUser.user_avatar.public_id) {
            cloudinary.uploader.destroy(foundUser.user_cover_image.public_id)
                .then(result => console.log("Delete image on cloud", result))
                .catch(error => console.log("Delete Image Error", error))
        }

        const newCoverImage = await cloudinary.uploader.upload(file.path, {
            folder: 'SocialMedia'
        })

        foundUser.user_cover_image = {
            public_id: newCoverImage.public_id,
            url: newCoverImage.secure_url,
        }
        await foundUser.save()
        return res.status(200).json({
            message: "Cập nhật Cover image thành công",
            meatadata: foundUser
        })

    } catch (error) {
        return res.status(500).json({
            message: "Lỗi hệ thống",
            meatadata: error.message
        })
    }

}

const unFriend = async (req, res) => {
    const userId = req.user.userId
    const { unFriendUserId } = req.body
    try {
        await unfriendService(userId, unFriendUserId)
        return res.status(200).json({
            message: "Hủy kết bạn thành công",
        })
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi hệ thống",
            meatadata: error.message
        })
    }
}

module.exports = {
    acceptFriendRequest, getFriendList, searchUser,
    getUserInfo, updateUserInfo, updateUserAvatar,
    updateUserCoverImage, rejectFriendRequest, unFriend
}