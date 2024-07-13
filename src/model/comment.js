const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "Comments";

// Declare the Schema of the Mongo model
var commentSchema = new mongoose.Schema({
    message: { type: String, required: true },
    user_id_create: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    post_id: { type: mongoose.Types.ObjectId, ref: "Post", required: true },
    parent_id: { type: mongoose.Types.ObjectId, ref: "Comment", default: null },
    children: { type: [{ type: mongoose.Types.ObjectId }] }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, commentSchema)