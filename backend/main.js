'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const initiateDb = require('./src/config/database');

const app = express();

initiateDb();

app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.use('/auth', require('./src/endpoints/authRoutes'));
app.use('/admin-portal', require('./src/endpoints/adminRoutes'));
app.use('/finance', require('./src/endpoints/payRoutes'));

const PORT_NUM = process.env.PORT || 5000;

app.listen(PORT_NUM, () => {
    console.info('[SERVER] Backend service started', {
        port: PORT_NUM,
        environment: process.env.NODE_ENV || 'development',
    });
});
