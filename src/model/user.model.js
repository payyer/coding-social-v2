const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true,
        index: true,
        trim: true,
        maxLength: 50
    },
    user_roles: {
        type: String,
        default: "USER"
    },
    user_avatar: {
        public_id: {
            type: String,
            default: null
        },
        url: {
            type: String,
            default: null
        }
    },
    user_email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    user_password: {
        type: String,
        required: true,
    },
    user_bio: {
        type: String,
        default: null
    },
    user_cv: {
        public_id: { type: String, default: null },
        url: { type: String, default: null }
    },
    user_birthday: {
        type: String,
        default: null
    },
    user_country: {
        type: String,
        required: false,
        default: null
    },
    // user_list_friend: {
    //     type: [mongoose.Types.ObjectId],
    // },
    // user_list_friend_request: {
    //     type: Array,
    //     ref: "friendRequest"
    // },
    user_display_settings: {
        user_email: {
            type: Boolean,
            default: true
        },
        user_bio: {
            type: Boolean,
            default: true
        },
        user_cv: {
            type: Boolean,
            default: true
        },
        user_birthday: {
            type: Boolean,
            default: true
        },
        user_country: {
            type: Boolean,
            default: true
        },
        user_list_friend: {
            type: Boolean,
            default: true
        },
    },
    user_verify: {
        type: Boolean,
        default: false,
    },
    email_verify_token: {
        type: String
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema)