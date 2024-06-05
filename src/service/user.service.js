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

module.exports = { addFriendService }