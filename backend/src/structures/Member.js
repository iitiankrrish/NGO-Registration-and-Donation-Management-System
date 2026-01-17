'use strict';

const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Name is required'],
    },
    officialEmail: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    secretHash: {
        type: String,
        required: true,
    },
    userRole: {
        type: String,
        enum: {
            values: ['supporter', 'admin', 'superadmin'],
            message: '{VALUE} is not a valid role',
        },
        default: 'supporter',
    },
    isApproved: {
        type: Boolean,
        default: true,
    },
    registeredAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Member', memberSchema);
