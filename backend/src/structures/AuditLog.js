'use strict';

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
    },
    actionPerformed: {
        type: String,
        required: true,
    },
    targetEntity: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
