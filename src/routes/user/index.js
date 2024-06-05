const express = require("express");
const { checkAuth } = require("../../auth/authentication");
const { acceptFriendRequest, getFriendList, searchUser } = require("../../controller/use.controller");
const router = express.Router()

router.use(checkAuth)

router.get('/getFriendList', getFriendList)
router.get('/search', searchUser)
router.post('/acceptFriendRequest', acceptFriendRequest)




module.exports = router;