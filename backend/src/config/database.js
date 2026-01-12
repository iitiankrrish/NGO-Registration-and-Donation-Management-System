const mongoose = require('mongoose');

const initiateDb = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_URI);
        console.log("Connected to MongoDB Compass successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = initiateDb;