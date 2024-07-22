const jobModel = require("../model/job")
const { uploadFile } = require("../utils/createVerifyCode")
const createJob = async (req, res) => {
    const userId = req.user.userId
    const files = req.files
    const { name, description, application_deadline, title } = req.body
    try {
        let media = []
        if (files && files.length > 0) {
            media = await uploadFile(files)
        }
        const newJob = await jobModel.create({ user_id: userId, application_deadline, avatar: media[0], description, name, title })

        return res.status(200).json({
            message: "Get all commnet successfully!",
            metadata: newJob,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            metadata: error.message,
        });
    }
}

const getAllJob = async (req, res) => {
    try {

        const newJob = await jobModel.find().lean()

        return res.status(200).json({
            message: "Get all commnet successfully!",
            metadata: newJob,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            metadata: error.message,
        });
    }
}

const getJob = async (req, res) => {
    const { jobId } = req.params
    try {
        const foundJob = await jobModel.findById(jobId).lean()

        return res.status(200).json({
            message: "Get job detail commnet successfully!",
            metadata: foundJob,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            metadata: error.message,
        });
    }
}

const getJobOffUser = async (req, res) => {
    const userId = req.user.userId
    try {
        const foundJob = await jobModel.find({ user_id: userId }).lean()

        return res.status(200).json({
            message: "Get job detail commnet successfully!",
            metadata: foundJob,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            metadata: error.message,
        });
    }
}


module.exports = { createJob, getAllJob, getJob, getJobOffUser }