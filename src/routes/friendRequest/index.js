const express = require("express");
const { checkAuth } = require("../../auth/authentication");
const { getFriendRequestList, sendFriendRequest, deleteFriendRequest } = require("../../controller/friendRequest.controller");
const router = express.Router()

router.use(checkAuth)

router.get('/', getFriendRequestList)
router.post('/sendFriendRequest', sendFriendRequest)
router.delete('/', deleteFriendRequest)




module.exports = router;