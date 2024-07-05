const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "LikePost";
const COLLECTION_NAME = "LikePosts";

// Declare the Schema of the Mongo model
var likePostSchema = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    post_id: { type: mongoose.Types.ObjectId, ref: "Post", required: true },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, likePostSchema)