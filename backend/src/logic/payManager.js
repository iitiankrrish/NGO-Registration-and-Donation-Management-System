'use strict';

const Donation = require('../structures/Donation');

exports.initiateDonation = async (req, res) => {
    const { amount } = req.body;

    try {
        const orderRef =
            'TXN_SIM_' +
            Math.random()
                .toString(36)
                .substr(2, 9)
                .toUpperCase();

        await Donation.create({
            donatedBy: req.user.uid,
            amountPaid: amount,
            orderRef: orderRef,
            paymentStatus: 'pending',
        });

        console.info('[DONATION_INITIATE] Donation attempt recorded', {
            userId: req.user.uid,
            orderRef,
            amount,
        });

        res.json({
            id: orderRef,
            amount: amount,
            currency: 'INR',
            gateway: 'Sandbox_Simulator',
        });
    } catch (error) {
        console.error('[DONATION_INITIATE] Initiation failed', {
            userId: req.user?.uid,
            errorName: error?.name,
            errorMessage: error?.message,
        });

        res.status(500).json({
            msg: 'Unable to initiate donation at this time',
        });
    }
};

exports.finalizeDonation = async (req, res) => {
    const { orderId, isSuccess, gatewayResponse } = req.body;
    const finalStatus = isSuccess ? 'success' : 'failed';

    try {
        const record = await Donation.findOneAndUpdate(
            { orderRef: orderId },
            {
                paymentStatus: finalStatus,
                internalNotes: `Simulator Response: ${JSON.stringify(
                    gatewayResponse || 'Verified_Offline'
                )}`,
            },
            { new: true }
        );

        if (!record) {
            console.warn('[DONATION_FINALIZE] Reference not found', {
                orderRef: orderId,
            });

            return res.status(404).json({ error: 'Reference ID not found' });
        }

        console.info('[DONATION_FINALIZE] Donation status updated', {
            orderRef: orderId,
            status: finalStatus,
        });

        res.json({
            msg: 'Transaction record updated',
            record,
        });
    } catch (error) {
        console.error('[DONATION_FINALIZE] Update failed', {
            orderRef: orderId,
            errorName: error?.name,
            errorMessage: error?.message,
        });

        res.status(500).json({
            error: 'Update failed',
        });
    }
};

exports.getMyHistory = async (req, res) => {
    console.info('[DONATION_HISTORY] History requested', {
        userId: req.user.uid,
    });

    const history = await Donation.find({ donatedBy: req.user.uid });

    res.json(history);
};
