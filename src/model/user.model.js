const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    user_name_no_tones: {
        type: String,
        required: true,
        trim: true,
        index: true,
        maxLength: 50
    },
    user_roles: {
        type: String,
        default: "USER"
    },
    user_avatar: {
        public_id: {
            type: String,
            default: ''
        },
        url: {
            type: String,
            default: "https://res.cloudinary.com/dpczfcxl8/image/upload/v1714629955/SocialMedia/fdcmy8wzovpuzyrvacae.png"
        }
    },

    user_cover_image: {
        public_id: {
            type: String,
            default: ''
        },
        url: {
            type: String,
            default: "https://res.cloudinary.com/dpczfcxl8/image/upload/v1719477061/Coding_Social_cv37a9.png"
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
        default: undefined
    },
    user_cv: {
        public_id: { type: String, default: '' },
        url: { type: String, default: '' }
    },
    user_birthday: {
        type: String,
        default: undefined
    },
    user_country: {
        type: String,
        default: undefined
    },
    user_list_friend: {
        type: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    },
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