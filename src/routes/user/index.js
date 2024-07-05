const express = require("express");
const multer = require("multer");

const { checkAuth } = require("../../auth/authentication");
const { acceptFriendRequest, getFriendList, searchUser, getUserInfo, updateUserInfo, updateUserAvatar, updateUserCoverImage, rejectFriendRequest, unFriend } = require("../../controller/use.controller");
const upload = multer({ dest: 'uploads' })
const router = express.Router()

router.use(checkAuth)

router.get('/search', searchUser)
router.get('/getFriendList', getFriendList)
router.get('/userInfo/:userId', getUserInfo)
router.post('/acceptFriendRequest', acceptFriendRequest)
router.delete('/rejectFriendRequest', rejectFriendRequest)
router.delete('/unFriend', unFriend)
router.put('/updateuserInfo', upload.array('files'), updateUserInfo)
router.put('/updateUserAvatar', upload.single('file'), updateUserAvatar)
router.put('/updateUserCoverImage', upload.single('file'), updateUserCoverImage)


module.exports = router;