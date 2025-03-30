const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        default: ""
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: ['user', 'admin']
    },
    profileImg: {
        type: String,
        default: 'https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png'
    },
    status: {
        type: String,
        enum: ['active', 'in-active', 'banned'],
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);