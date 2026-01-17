'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const initiateDb = require('./src/config/database');

const app = express();

initiateDb();

// CORS configuration for production
const allowedOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:5173', 'http://localhost:5174'];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (mobile apps, curl, etc.)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.warn('[CORS] Blocked origin:', origin);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);

// Trust proxy for secure cookies behind reverse proxy (Render, Heroku, etc.)
app.set('trust proxy', 1);

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
