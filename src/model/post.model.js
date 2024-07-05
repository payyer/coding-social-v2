const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "Post";
const COLLECTION_NAME = "Posts";

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    post_media: [
        {
            _id: { type: String },
            secure_url: { type: String },
            resource_type: { type: String }
        }
    ],
    post_content: { type: String },
    post_emoji: { type: Number, default: 0 },
    post_shared: { type: Number, default: 0 },
    post_comment: { type: Number, default: 0 },
    post_coment: { type: String },
    post_type: { type: String, required: true },
    post_share_id: { type: mongoose.Types.ObjectId, ref: "Post" },
    user_share_id: { type: mongoose.Types.ObjectId, ref: "User" }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema)