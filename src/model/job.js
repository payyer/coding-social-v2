const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "Job";
const COLLECTION_NAME = "Jobs";

var jobSchema = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    title: { type: String },
    name: { type: String },
    avatar: {
        _id: { type: String },
        secure_url: { type: String },
        resource_type: { type: String }
    },
    description: { type: String },
    application_deadline: { type: String },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = mongoose.model(DOCUMENT_NAME, jobSchema)