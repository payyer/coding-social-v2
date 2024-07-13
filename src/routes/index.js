const express = require("express");
const router = express.Router();
router.use("/user", require("./access"));
router.use("/user", require("./user"));
router.use("/chat", require("./chatRoom"));
router.use("/message", require("./message"));
router.use("/friendRequest", require("./friendRequest"));
router.use("/post", require("./post"));
router.use("/comment", require("./comment"));

module.exports = router;
