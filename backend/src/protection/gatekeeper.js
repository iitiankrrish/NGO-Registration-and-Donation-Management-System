'use strict';

const jwt = require('jsonwebtoken');

exports.verifyAccess = (req, res, next) => {
    const inboundToken = req.cookies.token_node;

    if (!inboundToken) {
        console.warn('[AUTH_VERIFY] Missing authentication token');
        return res.status(403).json({ msg: 'Authentication required' });
    }

    try {
        const validated = jwt.verify(inboundToken, process.env.SECRET_KEY);
        req.user = validated;

        console.info('[AUTH_VERIFY] Token verified', {
            userId: validated?.uid,
            role: validated?.role,
        });

        next();
    } catch (error) {
        console.warn('[AUTH_VERIFY] Token verification failed', {
            errorMessage: error?.message,
        });

        res.status(401).json({ msg: 'Session expired' });
    }
};

exports.authorize = (permittedRoles = []) => {
    return (req, res, next) => {
        const token = req.cookies.token_node;

        if (!token) {
            console.warn('[AUTH_AUTHORIZE] Missing authentication token');
            return res.status(401).json({ error: 'Access denied' });
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded;

            if (permittedRoles.length && !permittedRoles.includes(decoded.role)) {
                console.warn('[AUTH_AUTHORIZE] Permission denied', {
                    userId: decoded?.uid,
                    role: decoded?.role,
                });

                return res.status(403).json({ error: 'Insufficient permissions' });
            }

            console.info('[AUTH_AUTHORIZE] Authorization successful', {
                userId: decoded?.uid,
                role: decoded?.role,
            });

            next();
        } catch (error) {
            console.warn('[AUTH_AUTHORIZE] Invalid session', {
                errorMessage: error?.message,
            });

            return res.status(401).json({ error: 'Invalid session' });
        }
    };
};
