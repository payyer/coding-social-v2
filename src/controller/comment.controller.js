const commentModel = require("../model/comment");
const postModel = require("../model/post.model");
const { convertToObjectId } = require("../utils/createVerifyCode");

const getAllCommnet = async (req, res) => {
    const { post_id } = req.params
    try {
        const foundComments = await commentModel.find({ post_id: post_id })
            .populate({
                path: 'user_id_create',
                select: 'user_name user_avatar'
            })
            .populate({
                path: 'children',
                populate: {
                    path: 'user_id_create',
                    select: 'user_name user_avatar'
                }
            })
            .lean()

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
        await postModel.findOneAndUpdate(convertToObjectId(post_id), { $inc: { post_comment: 1 } }).lean()

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
        console.log({ foundComments })
        if (foundComments.children) {
            for (let i = 0; i < foundComments.children.length; i++) {
                await commentModel.findByIdAndDelete(foundComments.children[i]);
            }
        }
        await postModel.findOneAndUpdate(convertToObjectId(post_id), { $inc: { post_comment: -1 } }).lean()
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