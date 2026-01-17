const mongoose = require('mongoose');

const initiateDb = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_URI);
        console.log("Connected to MongoDB Compass successfully");
        // Ensure a default superadmin exists (credentials can be overridden via env)
        try {
            const Member = require('../structures/Member');
            const bcrypt = require('bcryptjs');
            const saEmail = process.env.SUPERADMIN_EMAIL || 'superadmin@example.com';
            const saPass = process.env.SUPERADMIN_PASSWORD || 'SuperAdmin123!';

            const exists = await Member.findOne({ officialEmail: saEmail.toLowerCase() });
            if (!exists) {
                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(saPass, salt);
                await Member.create({
                    fullName: 'Super Admin',
                    officialEmail: saEmail.toLowerCase(),
                    secretHash: hashed,
                    userRole: 'superadmin',
                    isApproved: true,
                });
                console.info('[DB_SETUP] Superadmin user created', { email: saEmail });
            }
        } catch (err) {
            console.warn('[DB_SETUP] Superadmin seeding failed', { err: err?.message });
        }
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = initiateDb;