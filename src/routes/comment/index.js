const express = require("express");
const { checkAuth } = require("../../auth/authentication");
const { createComment, getAllCommnet, deleteComment } = require("../../controller/comment.controller");
const router = express.Router();

router.use(checkAuth);

router.post("/", createComment);
router.delete("/", deleteComment);
router.get("/:post_id", getAllCommnet);


module.exports = router;
