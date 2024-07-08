const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "Message";
const COLLECTION_NAME = "Messages";

// Declare the Schema of the Mongo model
var messageSchema = new mongoose.Schema({
    chatRoomId: { type: mongoose.Types.ObjectId, ref: "ChatRoom", required: true },
    senderId: { type: String, requried: true },
    text: { type: String }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, messageSchema)