const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "TokenStore";
const COLLECTION_NAME = "TokensStore";

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    refresh_token: { type: String },
    refresh_token_list: { type: Array, default: [] }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema)