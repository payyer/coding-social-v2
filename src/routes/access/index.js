const express = require("express");
const { register, verifyEmail, login, getNewAccessToken, logout, sendVerifyCodeViaEmail, resetPassword } = require("../../controller/access.controller");
const router = express.Router()

router.post('/login', login)
router.post('/logout', logout)
router.put('/verify', verifyEmail)
router.post('/register', register)
router.post('/token', getNewAccessToken)
router.put('/resetPassword', resetPassword)
router.post('/sendVerifyCode', sendVerifyCodeViaEmail)
module.exports = router;