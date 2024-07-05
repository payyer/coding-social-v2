const likePostModel = require("../model/likePost.model")
const postModel = require("../model/post.model")
const { uploadFile, convertToObjectId } = require("../utils/createVerifyCode")

const getPostOfUser = async (req, res) => {
    const userId = req.params.userId
    const currentUserId = req.user.userId  // current userId is who login and have token
    try {

        const foundLikePosts = await likePostModel.find({ user_id: currentUserId }).lean()
        const likedPostIds = foundLikePosts.map(like => like.post_id.toString());

        // lấy các bài post và thêm feild isLike cho respone
        const posts = await postModel.find({ user_id: userId })
            .select("-updatedAt -__v")
            .populate({ path: 'user_id', select: "user_name user_avatar" })
            .sort({ createdAt: -1 })
            .lean()
        const postsWithIsLike = posts.map(post => ({
            ...post,
            isLike: likedPostIds.includes(post._id.toString())
        }));

        return res.status(200).json({
            message: "Lấy các bài post thành công",
            metadata: postsWithIsLike
        });

    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            metadata: error.message
        })
    }
}

const getAllPost = async (req, res) => {
    const currentUserId = req.user.userId
    try {
        const foundLikePosts = await likePostModel.find({ user_id: currentUserId }).lean()
        const likedPostIds = foundLikePosts.map(like => like.post_id.toString());

        const posts = await postModel.find()
            .select("-updatedAt -__v")
            .populate({ path: 'user_id', select: "user_name user_avatar" })
            .sort({ createdAt: -1 })
            .lean()
        const postsWithIsLike = posts.map(post => ({
            ...post,
            isLike: likedPostIds.includes(post._id.toString())
        }));

        return res.status(200).json({
            message: "Lấy bài viết thành công",
            metadata: postsWithIsLike
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            metadata: error.message
        })
    }
}

const createPost = async (req, res) => {
    const userId = req.user.userId
    const { content, postType } = req.body
    const files = req.files

    try {

        let media = []
        if (files && files.length > 0) {
            media = await uploadFile(files)
        }
        const newPost = await postModel.create({
            user_id: userId,
            post_content: content,
            post_type: postType,
            post_media: media
        })

        return res.status(200).json({
            message: "Tạo mới bài đăng thành công",
            metadata: newPost
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            metadata: error.message
        })
    }
}

const likePost = async (req, res) => {
    const userId = req.user.userId
    const { postId } = req.body

    try {
        const foundPost = await postModel.findOneAndUpdate(convertToObjectId(postId), { $inc: { post_emoji: 1 } }).lean()
        if (!foundPost) throw res.status(401).json({ message: "Không tìm thấy bài viết" })
        await likePostModel.create({ post_id: postId, user_id: userId })
        return res.status(200).json({
            message: "Like thành công",
        })

    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            metadata: error.message
        })
    }
}

const unLikePost = async (req, res) => {
    const userId = req.user.userId
    const { postId } = req.body
    try {
        const foundPostLike = await likePostModel.findOneAndDelete({ user_id: userId, post_id: postId })
        if (!foundPostLike) throw res.status(401).json({ message: "Chưa like mà đồi xóa" })
        await postModel.findByIdAndUpdate(convertToObjectId(postId), { $inc: { post_emoji: -1 } }, { new: true }).lean()

        return res.status(200).json({
            message: "Unlike thành công",
        })
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            metadata: error.message
        })
    }
}

const deletePost = async (req, res) => {
    const userId = req.user.userId
    const { postId } = req.body

    try {
        const foundPostOfUser = await postModel.findOne({ user_id: userId, _id: postId })

        if (!foundPostOfUser) throw res.status(400).json({ message: "Bạn không có quyền xóa bài viết này" })
        await likePostModel.deleteMany({ post_id: convertToObjectId(postId) })
        await postModel.findOneAndDelete({ user_id: convertToObjectId(userId), _id: convertToObjectId(postId) })
        return res.status(200).json({
            message: "Xóa bài đăng thành công",
        })
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            metadata: error.message
        })
    }
}

module.exports = { getPostOfUser, createPost, likePost, unLikePost, deletePost, getAllPost }