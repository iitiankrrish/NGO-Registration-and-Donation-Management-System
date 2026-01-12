'use strict';

const Member = require('../structures/Member');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.handleSignup = async (req, res) => {
    try {
        const { fullName, officialEmail, passCode, userRole } = req.body;

        console.info('[SIGNUP] Request received', {
            fullName,
            officialEmail,
            userRole,
        });

        if (!passCode) {
            return res.status(400).json({ msg: 'Password is required' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(passCode, salt);

        const newMember = new Member({
            fullName,
            officialEmail,
            secretHash: hashed,
            userRole: userRole || 'supporter',
        });

        await newMember.save();

        console.info('[SIGNUP] Member created successfully', {
            officialEmail,
            role: newMember.userRole,
        });

        res.status(201).json({ msg: 'Registration successful' });
    } catch (error) {
        console.error('[SIGNUP] Registration failed', {
            errorCode: error?.code,
            errorName: error?.name,
            errorMessage: error?.message,
        });

        if (error.code === 11000) {
            return res.status(400).json({
                msg: 'This email is already registered',
                error: error.message,
            });
        }

        res.status(400).json({
            msg: 'Validation failed',
            error: error.message,
        });
    }
};

exports.handleLogin = async (req, res) => {
    try {
        const { officialEmail, passCode } = req.body;

        const foundUser = await Member.findOne({
            officialEmail: officialEmail.toLowerCase(),
        });

        if (foundUser && (await bcrypt.compare(passCode, foundUser.secretHash))) {
            const token = jwt.sign(
                { uid: foundUser._id, role: foundUser.userRole },
                process.env.SECRET_KEY,
                { expiresIn: '5h' }
            );

            res.cookie('token_node', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 5 * 60 * 60 * 1000,
            });

            console.info('[LOGIN] Authentication successful', {
                officialEmail: foundUser.officialEmail,
                role: foundUser.userRole,
            });

            res.json({
                msg: 'Access granted',
                role: foundUser.userRole,
                name: foundUser.fullName,
            });
        } else {
            console.warn('[LOGIN] Authentication failed', {
                officialEmail,
            });

            res.status(401).json({ msg: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('[LOGIN] Login process failed', {
            errorName: error?.name,
            errorMessage: error?.message,
        });

        res.status(500).json({ msg: 'Server error during login' });
    }
};

exports.handleLogout = (req, res) => {
    res.clearCookie('token_node');

    console.info('[LOGOUT] Session terminated');

    res.json({ msg: 'Session ended' });
};

exports.getProfileDetails = async (req, res) => {
    try {
        const profile = await Member.findById(req.user.uid).select('-secretHash');

        console.info('[PROFILE] Profile retrieved', {
            userId: req.user.uid,
        });

        res.json(profile);
    } catch (error) {
        console.error('[PROFILE] Profile retrieval failed', {
            userId: req.user?.uid,
            errorMessage: error?.message,
        });

        res.status(404).json({ msg: 'User not found' });
    }
};
