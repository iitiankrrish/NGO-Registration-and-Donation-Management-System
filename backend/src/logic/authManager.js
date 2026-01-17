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
            // admin registrations require superadmin approval
            isApproved: userRole === 'admin' ? false : true,
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
            // prevent unapproved admins from logging in
            if (foundUser.userRole === 'admin' && !foundUser.isApproved) {
                return res.status(403).json({ msg: 'Admin account pending approval by superadmin' });
            }
            const token = jwt.sign(
                { uid: foundUser._id, role: foundUser.userRole },
                process.env.SECRET_KEY,
                { expiresIn: '5h' }
            );

            const isProduction = process.env.NODE_ENV === 'production';
            res.cookie('token_node', token, {
                httpOnly: true,
                secure: isProduction, // Must be true for sameSite: 'none'
                sameSite: isProduction ? 'none' : 'lax', // 'none' allows cross-origin
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
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('token_node', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
    });

    console.info('[LOGOUT] Session terminated');

    res.json({ msg: 'Session ended' });
};

exports.getProfileDetails = async (req, res) => {
    try {
        const profile = await Member.findById(req.user.uid).select('-secretHash');

        console.info('[PROFILE] Profile retrieved', {
            userId: req.user.uid,
        });

        // normalize returned profile shape
        res.json({
            _id: profile._id,
            fullName: profile.fullName,
            officialEmail: profile.officialEmail,
            userRole: profile.userRole,
            isApproved: profile.isApproved,
            registeredAt: profile.registeredAt,
        });
    } catch (error) {
        console.error('[PROFILE] Profile retrieval failed', {
            userId: req.user?.uid,
            errorMessage: error?.message,
        });

        res.status(404).json({ msg: 'User not found' });
    }
};
