const express = require("express");
const { checkAuth } = require("../../auth/authentication");
const { createJob, getAllJob, getJob, getJobOffUser } = require("../../controller/job.controller");
const multer = require("multer");
const upload = multer({ dest: 'uploads' })
const router = express.Router();

router.use(checkAuth);

router.post("/", upload.array('files'), createJob);
router.get("/", getAllJob);
router.get("/detail/:jobId", getJob);
router.get("/jobOfUser", getJobOffUser);


module.exports = router;
