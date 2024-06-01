const express = require("express");
const { checkAuth } = require("../../auth/authentication");
const router = express.Router()

router.use(checkAuth)

router.get('/test', (req, res) => {
    const user = req.user
    return res.json({
        message: "helo",
        user: user
    })
})




module.exports = router;