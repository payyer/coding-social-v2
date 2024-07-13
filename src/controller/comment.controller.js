const commentModel = require("../model/comment");
const { convertToObjectId } = require("../utils/createVerifyCode");

const getAllCommnet = async (req, res) => {
    const { post_id } = req.params
    try {
        const foundComments = await commentModel.find({ post_id: post_id }).lean()

        return res.status(200).json({
            message: "Get all commnet successfully!",
            metadata: foundComments,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            metadata: error.message,
        });
    }
}
const createComment = async (req, res) => {
    const userId = req.user.userId
    const { message, post_id, commentParent } = req.body
    try {
        const newComment = await commentModel.create({
            message,
            post_id: convertToObjectId(post_id),
            user_id_create: convertToObjectId(userId),
            parent_id: commentParent ? convertToObjectId(commentParent) : undefined,
        });

        if (commentParent) {
            await commentModel.findByIdAndUpdate(commentParent, {
                $push: { children: newComment._id }
            });
        }

        return res.status(200).json({
            message: "Create new commnet successfully!",
            metadata: newComment,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            metadata: error.message,
        });
    }
}
const deleteComment = async (req, res) => {
    const { commentId } = req.body
    try {
        const foundComments = await commentModel.findByIdAndDelete(convertToObjectId(commentId));
        if (foundComments.children) {
            for (let i = 0; i < foundComments.children.length; i++) {
                await commentModel.findByIdAndDelete(foundComments.children[i]);
            }
        }
        return res.status(200).json({
            message: "Delete comment successfully!",
            metadata: foundComments,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            metadata: error.message,
        });
    }
}

module.exports = { createComment, getAllCommnet, deleteComment }