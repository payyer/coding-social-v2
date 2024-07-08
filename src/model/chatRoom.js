const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = "ChatRoom";
const COLLECTION_NAME = "ChatRooms";

var chatSchema = new mongoose.Schema({
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});


//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, chatSchema);