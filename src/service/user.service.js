const userModel = require("../model/user.model")
const { convertToObjectId } = require("../utils/createVerifyCode")

const addFriendService = async (userId, senderId) => {
    await userModel.findByIdAndUpdate(userId,
        {
            $push: {
                user_list_friend: convertToObjectId(senderId)
            }
        },
        { new: true }
    )
    await userModel.findByIdAndUpdate(senderId,
        {
            $push: {
                user_list_friend: convertToObjectId(userId)
            }
        },
        { new: true }
    )
}

const unfriendService = async (userId, unFriendUserId) => {
    await userModel.findByIdAndUpdate(userId,
        {
            $pull: { user_list_friend: convertToObjectId(unFriendUserId) }
        },
        { new: true })
    await userModel.findByIdAndUpdate(unFriendUserId,
        {
            $pull: { user_list_friend: convertToObjectId(userId) }
        },
        { new: true })
}

module.exports = { addFriendService, unfriendService }