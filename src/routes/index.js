const express = require('express')
const router = express.Router()

router.use("/user", require('./access'))
router.use("/user", require('./user'))
router.use("/friendRequest", require('./friendRequest'))
router.use("/post", require('./post'))

module.exports = router