const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Email = mongoose.model('Email', EmailSchema);

module.exports = Email;