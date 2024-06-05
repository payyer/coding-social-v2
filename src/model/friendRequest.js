const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "FriendRequest";
const COLLECTION_NAME = "FriendRequests";

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    sender_id: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    receiver_id: { type: mongoose.Types.ObjectId, ref: "User", required: true },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema)