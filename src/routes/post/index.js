const express = require("express");
const multer = require("multer");
const { checkAuth } = require("../../auth/authentication");
const { getPostOfUser, createPost, likePost, unLikePost, deletePost, getAllPost } = require("../../controller/post.controller");
const upload = multer({ dest: 'uploads' })
const router = express.Router()

router.use(checkAuth)

router.get('/userPost/:userId', getPostOfUser)
router.get('/', getAllPost)
router.post('/', upload.array('files'), createPost)
router.put('/likePost', likePost)
router.put('/unLikePost', unLikePost)
router.delete('/deletePost', deletePost)





module.exports = router;