'use strict';

const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
    },
    amountPaid: {
        type: Number,
        required: true,
    },
    orderRef: {
        type: String,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending',
    },
    internalNotes: {
        type: String,
    },
    transactionTime: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Donation', donationSchema);
