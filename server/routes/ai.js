const router = require('express').Router();
const { analyzeWallet, chat, generateReport } = require('../controllers/aiController');

router.post('/analyze', analyzeWallet);
router.post('/chat', chat);
router.post('/report', generateReport);

module.exports = router;
