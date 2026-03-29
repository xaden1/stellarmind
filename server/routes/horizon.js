const router = require('express').Router();
const { getWalletData } = require('../controllers/horizonController');

router.get('/wallet/:walletAddress', getWalletData);

module.exports = router;
