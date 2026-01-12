const express = require('express');
const router = express.Router();
const authCtrl = require('../logic/authManager');
const { verifyAccess } = require('../protection/gatekeeper'); 
router.get('/me', verifyAccess, authCtrl.getProfileDetails);
router.post('/signup', authCtrl.handleSignup);
router.post('/signin', authCtrl.handleLogin);
router.post('/logout', authCtrl.handleLogout); 
module.exports = router;