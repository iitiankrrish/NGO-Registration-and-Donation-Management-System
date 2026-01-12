const express = require('express');
const router = express.Router();
const payCtrl = require('../logic/payManager');
const { verifyAccess } = require('../protection/gatekeeper');

router.post('/create-order', verifyAccess, payCtrl.initiateDonation);
router.post('/update-status', verifyAccess, payCtrl.finalizeDonation);
router.get('/my-donations', verifyAccess, payCtrl.getMyHistory);

module.exports = router;