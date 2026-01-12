'use strict';

const Member = require('../structures/Member');
const Donation = require('../structures/Donation');
const AuditLog = require('../structures/AuditLog');

exports.getFinancialInsights = async (req, res) => {
    try {
        const history = await Donation.aggregate([
            { $match: { paymentStatus: 'success' } },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$transactionTime',
                        },
                    },
                    dailyTotal: { $sum: '$amountPaid' },
                    transactionCount: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        await AuditLog.create({
            adminId: req.user.uid,
            actionPerformed: 'VIEW_FINANCIAL_ANALYTICS',
        });

        console.info('[FINANCIAL_INSIGHTS] Data retrieved successfully');

        res.json(history);
    } catch (error) {
        console.error('[FINANCIAL_INSIGHTS] Retrieval failed', {
            errorName: error?.name,
            errorMessage: error?.message,
        });

        res.status(500).json({
            msg: 'Unable to generate financial insights at this time',
        });
    }
};

exports.getGlobalStats = async (req, res) => {
    try {
        const count = await Member.countDocuments({ userRole: 'supporter' });

        const funds = await Donation.aggregate([
            { $match: { paymentStatus: 'success' } },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amountPaid' },
                },
            },
        ]);

        console.info('[GLOBAL_STATS] Computation successful');

        res.json({
            totalRegistrations: count,
            totalCollected: funds[0]?.total || 0,
        });
    } catch (error) {
        console.error('[GLOBAL_STATS] Computation failed', {
            errorName: error?.name,
            errorMessage: error?.message,
        });

        res.status(500).json({
            error: 'Unable to retrieve global statistics',
        });
    }
};

exports.listAllSupporters = async (req, res) => {
    const { searchName } = req.query;

    const filter = { userRole: 'supporter' };

    if (searchName) {
        filter.fullName = { $regex: searchName, $options: 'i' };
    }

    console.info('[SUPPORTERS] Fetch initiated', {
        filtered: Boolean(searchName),
    });

    const data = await Member.find(filter).select('-secretHash');

    res.json(data);
};

exports.downloadReport = async (req, res) => {
    const members = await Member.find({ userRole: 'supporter' });

    console.info('[REPORT] CSV generation started', {
        recordCount: members.length,
    });

    let csvContent = 'Full Name,Email,Joined Date\n';

    members.forEach((member) => {
        csvContent += `${member.fullName},${member.officialEmail},${member.registeredAt}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.attachment('ngo_members.csv');
    res.status(200).send(csvContent);
};

exports.fetchRegistrySnapshot = async (req, res) => {
    try {
        const allTransactions = await Donation.find()
            .populate('donatedBy', 'fullName officialEmail')
            .sort({ transactionTime: -1 });

        console.info('[REGISTRY_SNAPSHOT] Records retrieved', {
            recordCount: allTransactions.length,
        });

        res.json(allTransactions);
    } catch (error) {
        console.error('[REGISTRY_SNAPSHOT] Retrieval failed', {
            errorName: error?.name,
            errorMessage: error?.message,
        });

        res.status(500).json({
            error: 'Unable to fetch donation records at this time',
        });
    }
};
